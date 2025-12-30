// Note: Due to Prisma 7 ESM module structure, this seed script has compatibility issues
// Sectors are automatically created on first user signup, so seeding is optional
// If you need to seed manually, you can use Prisma Studio or create sectors via the app

console.log("Note: Seed script has Prisma 7 compatibility issues.");
console.log("Sectors will be auto-created on first user signup.");
console.log("To seed market prices, you can add them via the app or Prisma Studio.");
process.exit(0);

async function main() {
  console.log("Seeding database...");

  // Create sectors
  const sectorA = await prisma.sector.upsert({
    where: { name: "Sector A" },
    update: {},
    create: { name: "Sector A" },
  });

  const sectorB = await prisma.sector.upsert({
    where: { name: "Sector B" },
    update: {},
    create: { name: "Sector B" },
  });

  const sectorC = await prisma.sector.upsert({
    where: { name: "Sector C" },
    update: {},
    create: { name: "Sector C" },
  });

  console.log("Created sectors:", { sectorA, sectorB, sectorC });

  // Create initial market price snapshots for each sector
  const sectors = [sectorA, sectorB, sectorC];
  const metals: MetalType[] = ["SOL", "AES", "VIR", "LUN", "NOC", "CRN"];

  for (const sector of sectors) {
    for (const metal of metals) {
      // Add some random variation per sector (±5%)
      const variation = 1 + (Math.random() - 0.5) * 0.1;
      const price = BASE_PRICES[metal] * variation;

      await prisma.marketPriceSnapshot.create({
        data: {
          sectorId: sector.id,
          metalType: metal,
          price,
        },
      });
    }
  }

  console.log("Created market price snapshots");

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

