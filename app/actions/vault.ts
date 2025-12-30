"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getVault() {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Not authenticated");
  }

  const vaultBalance = await prisma.vaultBalance.findUnique({
    where: { userId: session.user.id },
  });

  const vaultSpecimens = await prisma.vaultSpecimen.findMany({
    where: { userId: session.user.id },
    orderBy: { depositedAt: "desc" },
  });

  return {
    balance: vaultBalance,
    specimens: vaultSpecimens,
  };
}

