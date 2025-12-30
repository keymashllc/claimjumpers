// Import Prisma client using runtime require to avoid webpack TypeScript parsing
// We use a JS shim that loads the actual client at runtime

// Get PrismaClient class from the shim (loaded at runtime, not bundled)
const getPrismaClientClass = require("./prisma-shim.js");
const PrismaClientClass = getPrismaClientClass();

// Import type only (doesn't get bundled)
import type { PrismaClient } from "../node_modules/.prisma/client/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClientClass({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  } as any);

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

