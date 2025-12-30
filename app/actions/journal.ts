"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getJournal() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const slots = await prisma.journalSlot.findMany({
    where: { userId: session.user.id },
    include: { vaultSpecimen: true },
    orderBy: [{ pageType: "asc" }, { slotIndex: "asc" }],
  });

  return slots;
}

