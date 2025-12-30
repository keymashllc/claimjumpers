import {
  MetalType,
  Biome,
  SpecimenForm,
  SpecimenGrade,
} from "@/lib/prisma-types";
import {
  BIOME_METAL_WEIGHTS,
  SPECIMEN_CHANCE,
  VEIN_EV,
  FORM_BASE_UNITS,
  GRADE_MULTIPLIERS,
  GRADE_DISTRIBUTION,
  DRILL_DAMAGE_CHANCE,
  BLAST_DAMAGE_CHANCE,
  BASE_PRICES,
} from "./constants";
import { MiningMode, VeinResult, MiningShiftResult } from "./types";

/**
 * Select a metal type based on biome weights
 */
export function selectMetalByBiome(biome: Biome, random: number = Math.random()): MetalType {
  const weights = BIOME_METAL_WEIGHTS[biome];
  const entries = Object.entries(weights) as [MetalType, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  
  let cumulative = 0;
  for (const [metal, weight] of entries) {
    cumulative += weight;
    if (random * total < cumulative) {
      return metal;
    }
  }
  
  // Fallback (shouldn't happen)
  return entries[0][0];
}

/**
 * Generate a random grade based on depth
 */
export function generateGrade(depth: number, random: number = Math.random()): SpecimenGrade {
  const distribution = GRADE_DISTRIBUTION[depth];
  const rand = random;
  
  if (rand < distribution.Low) return "Low";
  if (rand < distribution.Low + distribution.High) return "High";
  return "Ultra";
}

/**
 * Generate a random form
 */
export function generateForm(random: number = Math.random()): SpecimenForm {
  const forms: SpecimenForm[] = ["Ore", "Nugget", "Coin", "Bar"];
  return forms[Math.floor(random * forms.length)];
}

/**
 * Calculate specimen melt units
 */
export function calculateSpecimenUnits(form: SpecimenForm, grade: SpecimenGrade): number {
  return Math.round(FORM_BASE_UNITS[form] * GRADE_MULTIPLIERS[grade]);
}

/**
 * Generate a single vein result
 */
export function generateVein(
  biome: Biome,
  depth: number,
  random: number = Math.random()
): VeinResult {
  const isSpecimen = random < SPECIMEN_CHANCE[depth];
  
  if (isSpecimen) {
    const metalType = selectMetalByBiome(biome, Math.random());
    const form = generateForm(Math.random());
    const grade = generateGrade(depth, Math.random());
    
    return {
      isSpecimen: true,
      specimen: {
        form,
        grade,
        metalType,
        biome,
      },
    };
  } else {
    // Generate units bundle
    const metalType = selectMetalByBiome(biome, Math.random());
    // Use a simple approach: generate value around EV, convert to units
    const baseEV = depth === 1 ? 190 : depth === 2 ? 270 : 360;
    // Add some variance: ±30% of EV
    const variance = (Math.random() * 0.6 - 0.3) * baseEV;
    const value = baseEV + variance;
    const units = Math.max(1, Math.round(value / BASE_PRICES[metalType]));
    
    return {
      isSpecimen: false,
      metalType,
      units,
    };
  }
}

/**
 * Calculate damage for a mining shift
 */
export function calculateMiningDamage(
  mode: MiningMode,
  depth: number,
  random1: number = Math.random(),
  random2: number = Math.random()
): number {
  if (mode === "drill") {
    return random1 < DRILL_DAMAGE_CHANCE[depth] ? 1 : 0;
  } else {
    // Blast: 35% chance 1 damage, 15% chance additional 1 damage
    let damage = 0;
    if (random1 < BLAST_DAMAGE_CHANCE.first) {
      damage = 1;
      if (random2 < BLAST_DAMAGE_CHANCE.second) {
        damage = 2;
      }
    }
    return damage;
  }
}

/**
 * Mine a full shift (3 veins)
 */
export function mineShift(
  biome: Biome,
  depth: number,
  mode: MiningMode
): MiningShiftResult {
  const veins: VeinResult[] = [];
  let totalDamage = 0;
  
  // Calculate damage for the shift
  totalDamage = calculateMiningDamage(mode, depth);
  
  // Generate 3 veins
  for (let i = 0; i < 3; i++) {
    veins.push(generateVein(biome, depth));
  }
  
  return {
    veins,
    damage: totalDamage,
  };
}

