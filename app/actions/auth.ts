"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function signUp(email: string, password: string) {
  // Check if user exists
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("User already exists");
  }

  // Get or assign sector (simple round-robin for MVP)
  const sectors = await prisma.sector.findMany();
  let sectorId: string;
  
  if (sectors.length === 0) {
    // Create default sectors if none exist
    const sectorA = await prisma.sector.create({ data: { name: "Sector A" } });
    const sectorB = await prisma.sector.create({ data: { name: "Sector B" } });
    const sectorC = await prisma.sector.create({ data: { name: "Sector C" } });
    sectorId = sectorA.id; // Assign to first
  } else {
    // Simple assignment: use first sector for MVP
    sectorId = sectors[0].id;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      sectorId,
    },
  });

  // Create vault balance
  await prisma.vaultBalance.create({
    data: { userId: user.id },
  });

  // Sign in
  await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  redirect("/run");
}

export async function signInAction(email: string, password: string) {
  const result = await signIn("credentials", {
    email,
    password,
    redirect: false,
  });

  if (result?.error) {
    throw new Error("Invalid credentials");
  }

  redirect("/run");
}

