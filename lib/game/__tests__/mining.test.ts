import { describe, it, expect } from "@jest/globals";
import { generateVein, calculateMiningDamage, calculateSpecimenUnits } from "../mining";
import { Biome, SpecimenForm, SpecimenGrade } from "../../../node_modules/.prisma/client/enums";

describe("Mining Logic", () => {
  it("should generate a vein result", () => {
    const result = generateVein("Desert", 1);
    expect(result).toHaveProperty("isSpecimen");
    if (result.isSpecimen) {
      expect(result.specimen).toBeDefined();
      expect(result.specimen?.metalType).toBeDefined();
      expect(result.specimen?.form).toBeDefined();
      expect(result.specimen?.grade).toBeDefined();
    } else {
      expect(result.metalType).toBeDefined();
      expect(result.units).toBeGreaterThan(0);
    }
  });

  it("should calculate mining damage for drill", () => {
    // Test multiple times to check probability
    const results: number[] = [];
    for (let i = 0; i < 100; i++) {
      const damage = calculateMiningDamage("drill", 1);
      results.push(damage);
    }
    // Should have some damage (15% chance)
    const hasDamage = results.some((d) => d > 0);
    expect(hasDamage).toBe(true);
  });

  it("should calculate mining damage for blast", () => {
    const results: number[] = [];
    for (let i = 0; i < 100; i++) {
      const damage = calculateMiningDamage("blast", 1);
      results.push(damage);
      expect(damage).toBeGreaterThanOrEqual(0);
      expect(damage).toBeLessThanOrEqual(2);
    }
    // Should have some damage (35% chance)
    const hasDamage = results.some((d) => d > 0);
    expect(hasDamage).toBe(true);
  });

  it("should calculate specimen units correctly", () => {
    // Ore, Low grade: 4 * 1.0 = 4
    expect(calculateSpecimenUnits("Ore", "Low")).toBe(4);
    
    // Bar, High grade: 8 * 1.5 = 12
    expect(calculateSpecimenUnits("Bar", "High")).toBe(12);
    
    // Coin, Ultra grade: 7 * 2.3 = 16.1 -> 16
    expect(calculateSpecimenUnits("Coin", "Ultra")).toBe(16);
  });
});

