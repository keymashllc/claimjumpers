"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DUE_CURVE, REPAIR_COST_PER_HP, STARTING_HP } from "@/lib/game/constants";
import { mineShift } from "@/lib/game/mining";
import { getBidPrice, getMarketPrice } from "@/lib/game/market";
import { calculateSpecimenUnits } from "@/lib/game/mining";
import { Biome } from "@/lib/prisma-types";
import { revalidatePath } from "next/cache";

export async function startRun() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  // Check for active run
  const activeRun = await prisma.run.findFirst({
    where: {
      userId: session.user.id,
      status: "Active",
    },
  });

  if (activeRun) {
    throw new Error("You already have an active run");
  }

  // Create new run
  const run = await prisma.run.create({
    data: {
      userId: session.user.id,
      status: "Active",
      currentDay: 1,
      credits: 0,
      hp: STARTING_HP,
    },
  });

  // Create day state for day 1
  await prisma.dayState.create({
    data: {
      runId: run.id,
      day: 1,
      due: DUE_CURVE[0],
      paid: false,
      shiftsUsed: 0,
    },
  });

  revalidatePath("/run");
  return { success: true, runId: run.id };
}

export async function getActiveRun() {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const run = await prisma.run.findFirst({
    where: {
      userId: session.user.id,
      status: "Active",
    },
    include: {
      dayStates: {
        orderBy: { day: "asc" },
      },
      stashItems: true,
      specimens: true,
      ownedRelics: {
        where: { used: false },
      },
    },
  });

  return run;
}

export async function mine(
  runId: string,
  biome: Biome,
  depth: number,
  mode: "drill" | "blast"
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const run = await prisma.run.findFirst({
    where: {
      id: runId,
      userId: session.user.id,
      status: "Active",
    },
  });

  if (!run) {
    throw new Error("Run not found");
  }

  const dayState = await prisma.dayState.findFirst({
    where: {
      runId: run.id,
      day: run.currentDay,
    },
  });

  if (!dayState) {
    throw new Error("Day state not found");
  }

  if (dayState.shiftsUsed >= 2) {
    throw new Error("All shifts used for today");
  }

  // Mine the shift
  const result = mineShift(biome, depth, mode);

  // Apply damage
  const newHp = Math.max(0, run.hp - result.damage);

  // Update run
  await prisma.run.update({
    where: { id: runId },
    data: { hp: newHp },
  });

  // Update day state
  await prisma.dayState.update({
    where: { id: dayState.id },
    data: { shiftsUsed: dayState.shiftsUsed + 1 },
  });

  // Create stash items and specimens
  for (const vein of result.veins) {
    if (vein.isSpecimen && vein.specimen) {
      await prisma.specimen.create({
        data: {
          runId: run.id,
          metalType: vein.specimen.metalType,
          form: vein.specimen.form,
          grade: vein.specimen.grade,
          biome: vein.specimen.biome,
        },
      });
    } else if (vein.metalType && vein.units) {
      await prisma.stashItem.create({
        data: {
          runId: run.id,
          metalType: vein.metalType,
          units: vein.units,
        },
      });
    }
  }

  // Check if HP is 0 (run ends)
  if (newHp === 0) {
    await prisma.run.update({
      where: { id: runId },
      data: { status: "Lost" },
    });
  }

  revalidatePath("/run");
  return { success: true, result, newHp };
}

export async function processDrop(
  runId: string,
  itemId: string,
  itemType: "stash" | "specimen",
  action: "keep" | "melt" | "sell"
) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const run = await prisma.run.findFirst({
    where: {
      id: runId,
      userId: session.user.id,
      status: "Active",
    },
  });

  if (!run) {
    throw new Error("Run not found");
  }

  if (itemType === "specimen") {
    const specimen = await prisma.specimen.findFirst({
      where: { id: itemId, runId: run.id },
    });

    if (!specimen) {
      throw new Error("Specimen not found");
    }

    if (action === "melt") {
      const units = calculateSpecimenUnits(specimen.form, specimen.grade);
      // Delete specimen, create stash item
      await prisma.specimen.delete({ where: { id: itemId } });
      await prisma.stashItem.create({
        data: {
          runId: run.id,
          metalType: specimen.metalType,
          units,
        },
      });
    } else if (action === "sell") {
      const units = calculateSpecimenUnits(specimen.form, specimen.grade);
      const basePrice = getMarketPrice(specimen.metalType);
      const bidPrice = getBidPrice(basePrice);
      const credits = Math.round(units * bidPrice);
      
      await prisma.specimen.delete({ where: { id: itemId } });
      await prisma.run.update({
        where: { id: runId },
        data: { credits: run.credits + credits },
      });
    }
    // "keep" does nothing
  } else {
    const stashItem = await prisma.stashItem.findFirst({
      where: { id: itemId, runId: run.id },
    });

    if (!stashItem) {
      throw new Error("Stash item not found");
    }

    if (action === "sell") {
      const basePrice = getMarketPrice(stashItem.metalType);
      const bidPrice = getBidPrice(basePrice);
      const credits = Math.round(stashItem.units * bidPrice);
      
      await prisma.stashItem.delete({ where: { id: itemId } });
      await prisma.run.update({
        where: { id: runId },
        data: { credits: run.credits + credits },
      });
    }
    // "keep" and "melt" (already units) do nothing
  }

  revalidatePath("/run");
  return { success: true };
}

export async function repair(runId: string, hpToRepair: number) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const run = await prisma.run.findFirst({
    where: {
      id: runId,
      userId: session.user.id,
      status: "Active",
    },
  });

  if (!run) {
    throw new Error("Run not found");
  }

  const cost = hpToRepair * REPAIR_COST_PER_HP;
  if (run.credits < cost) {
    throw new Error("Not enough credits");
  }

  const newHp = Math.min(STARTING_HP, run.hp + hpToRepair);
  const actualRepair = newHp - run.hp;

  await prisma.run.update({
    where: { id: runId },
    data: {
      hp: newHp,
      credits: run.credits - (actualRepair * REPAIR_COST_PER_HP),
    },
  });

  revalidatePath("/run");
  return { success: true };
}

export async function payDue(runId: string, useLoanVoucher: boolean = false) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const run = await prisma.run.findFirst({
    where: {
      id: runId,
      userId: session.user.id,
      status: "Active",
    },
  });

  if (!run) {
    throw new Error("Run not found");
  }

  const dayState = await prisma.dayState.findFirst({
    where: {
      runId: run.id,
      day: run.currentDay,
    },
  });

  if (!dayState) {
    throw new Error("Day state not found");
  }

  const ownedRelics = await prisma.ownedRelic.findMany({
    where: {
      runId: run.id,
      relicType: "LoanVoucher",
      used: false,
    },
  });

  if (dayState.paid) {
    throw new Error("Day already paid");
  }

  let shortfall = dayState.due - run.credits;
  let canPay = run.credits >= dayState.due;

  if (!canPay && useLoanVoucher && ownedRelics.length > 0) {
    // Use loan voucher
    const voucher = ownedRelics[0];
    await prisma.ownedRelic.update({
      where: { id: voucher.id },
      data: { used: true, usedAt: new Date() },
    });
    canPay = true;
    shortfall = 0;
  }

  if (!canPay) {
    // Run ends - confiscate everything
    await prisma.run.update({
      where: { id: runId },
      data: { status: "Lost" },
    });
    revalidatePath("/run");
    return { success: false, lost: true, shortfall };
  }

  // Pay the due
  await prisma.run.update({
    where: { id: runId },
    data: { credits: run.credits - dayState.due },
  });

  await prisma.dayState.update({
    where: { id: dayState.id },
    data: { paid: true },
  });

  // Check if it's day 12 (win condition)
  if (run.currentDay === 12) {
    // Win! Deposit to vault
    await depositToVault(runId, session.user.id);
    await prisma.run.update({
      where: { id: runId },
      data: { status: "Won" },
    });
    revalidatePath("/run");
    return { success: true, won: true };
  }

  // Advance to next day
  const nextDay = run.currentDay + 1;
  const nextDue = DUE_CURVE[nextDay - 1];
  
  // Apply loan voucher penalty if used
  const finalDue = useLoanVoucher ? Math.round(nextDue * 1.35) : nextDue;

  await prisma.run.update({
    where: { id: runId },
    data: { currentDay: nextDay },
  });

  await prisma.dayState.create({
    data: {
      runId: run.id,
      day: nextDay,
      due: finalDue,
      paid: false,
      shiftsUsed: 0,
    },
  });

  revalidatePath("/run");
  return { success: true, nextDay };
}

async function depositToVault(runId: string, userId: string) {
  // Get all remaining stash items and specimens
  const stashItems = await prisma.stashItem.findMany({
    where: { runId },
  });

  const specimens = await prisma.specimen.findMany({
    where: { runId },
  });

  // Get or create vault balance
  let vaultBalance = await prisma.vaultBalance.findUnique({
    where: { userId },
  });

  if (!vaultBalance) {
    vaultBalance = await prisma.vaultBalance.create({
      data: { userId },
    });
  }

  // Convert stash items to units in vault
  const unitUpdates: Record<string, number> = {};
  for (const item of stashItems) {
    const key = `${item.metalType.toLowerCase()}Units` as keyof typeof unitUpdates;
    unitUpdates[key] = (unitUpdates[key] || 0) + item.units;
  }

  // Update vault balance
  await prisma.vaultBalance.update({
    where: { userId },
    data: {
      ...unitUpdates,
      credits: vaultBalance.credits + 0, // Stash items are units, not credits
    },
  });

  // Deposit specimens to vault
  for (const specimen of specimens) {
    await prisma.vaultSpecimen.create({
      data: {
        userId,
        metalType: specimen.metalType,
        form: specimen.form,
        grade: specimen.grade,
        biome: specimen.biome,
        originalSpecimenId: specimen.id,
      },
    });
  }

  // Update journal
  await updateJournal(userId, specimens);
}

async function updateJournal(userId: string, specimens: any[]) {
  // Get all journal pages
  const allPages = [
    // Metal pages
    ...["SOL", "AES", "VIR", "LUN", "NOC", "CRN"].flatMap((metal) =>
      Array.from({ length: 6 }, (_, i) => ({
        pageType: `metal-${metal}`,
        slotIndex: i,
        requirements: { metalType: metal },
      }))
    ),
    // Biome pages
    ...["Desert", "Rift", "Glacier"].flatMap((biome) =>
      Array.from({ length: 6 }, (_, i) => ({
        pageType: `biome-${biome}`,
        slotIndex: i,
        requirements: { biome },
      }))
    ),
    // Form pages
    ...["Coin", "Bar"].flatMap((form) =>
      Array.from({ length: 6 }, (_, i) => ({
        pageType: `form-${form}`,
        slotIndex: i,
        requirements: { form },
      }))
    ),
    // Ultra grade page
    ...Array.from({ length: 6 }, (_, i) => ({
      pageType: "grade-Ultra",
      slotIndex: i,
      requirements: { grade: "Ultra" },
    })),
  ];

  // Get existing filled slots
  const existingSlots = await prisma.journalSlot.findMany({
    where: { userId },
    select: { pageType: true, slotIndex: true },
  });

  const filledSlots = new Set(
    existingSlots.map((s: { pageType: string; slotIndex: number }) => `${s.pageType}-${s.slotIndex}`)
  );

  // Process each specimen
  for (const specimen of specimens) {
    // Find all matching slots (MVP: can fill multiple)
    const matchingSlots = allPages.filter((slot) => {
      const key = `${slot.pageType}-${slot.slotIndex}`;
      if (filledSlots.has(key)) return false;

      const req = slot.requirements as {
        metalType?: string;
        biome?: string;
        form?: string;
        grade?: string;
      };
      if (req.metalType && specimen.metalType !== req.metalType) return false;
      if (req.biome && specimen.biome !== req.biome) return false;
      if (req.form && specimen.form !== req.form) return false;
      if (req.grade && specimen.grade !== req.grade) return false;

      return true;
    });

    // Fill matching slots (create vault specimen first if needed, then link)
    for (const slot of matchingSlots) {
      const vaultSpecimen = await prisma.vaultSpecimen.findFirst({
        where: {
          userId,
          metalType: specimen.metalType,
          form: specimen.form,
          grade: specimen.grade,
          biome: specimen.biome,
          depositedAt: {
            gte: new Date(Date.now() - 1000), // Just deposited
          },
        },
        orderBy: { depositedAt: "desc" },
      });

      if (vaultSpecimen) {
        await prisma.journalSlot.create({
          data: {
            userId,
            pageType: slot.pageType,
            slotIndex: slot.slotIndex,
            vaultSpecimenId: vaultSpecimen.id,
            filledAt: new Date(),
          },
        });
        filledSlots.add(`${slot.pageType}-${slot.slotIndex}`);
      }
    }
  }
}

