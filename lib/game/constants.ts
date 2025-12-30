import { MetalType, Biome, SpecimenForm, SpecimenGrade } from "@/lib/prisma-types";

// Daily payment curve (Credits)
export const DUE_CURVE = [250, 330, 430, 560, 730, 950, 1240, 1620, 2120, 2770, 3620, 4740];

// Base metal prices (Credits per unit)
export const BASE_PRICES: Record<MetalType, number> = {
  SOL: 20,
  AES: 28,
  VIR: 26,
  LUN: 32,
  NOC: 55,
  CRN: 180,
};

// Commodity spread: 2% total (1% each side)
export const BID_MULTIPLIER = 0.99;
export const ASK_MULTIPLIER = 1.01;

// Repair cost per damage point
export const REPAIR_COST_PER_HP = 180;

// Starting HP
export const STARTING_HP = 10;

// Shifts per day
export const SHIFTS_PER_DAY = 2;
export const VEINS_PER_SHIFT = 3;

// Biome metal weights (percentages)
export const BIOME_METAL_WEIGHTS: Record<Biome, Record<MetalType, number>> = {
  Desert: {
    SOL: 50,
    LUN: 30,
    AES: 15,
    VIR: 5,
    NOC: 0,
    CRN: 0,
  },
  Rift: {
    VIR: 40,
    AES: 30,
    NOC: 20,
    LUN: 10,
    SOL: 0,
    CRN: 0,
  },
  Glacier: {
    SOL: 40,
    LUN: 35,
    AES: 15,
    VIR: 9,
    NOC: 0,
    CRN: 1,
  },
};

// Specimen chance per depth
export const SPECIMEN_CHANCE: Record<number, number> = {
  1: 0.08,
  2: 0.14,
  3: 0.22,
};

// Expected values per vein (before spread/repairs)
export const VEIN_EV: Record<number, { drill: number; blast: number }> = {
  1: { drill: 190, blast: 230 },
  2: { drill: 270, blast: 330 },
  3: { drill: 360, blast: 450 },
};

// Specimen form base units
export const FORM_BASE_UNITS: Record<SpecimenForm, number> = {
  Ore: 4,
  Nugget: 6,
  Coin: 7,
  Bar: 8,
};

// Grade multipliers
export const GRADE_MULTIPLIERS: Record<SpecimenGrade, number> = {
  Low: 1.0,
  High: 1.5,
  Ultra: 2.3,
};

// Grade distribution within specimens by depth
export const GRADE_DISTRIBUTION: Record<number, Record<SpecimenGrade, number>> = {
  1: { Low: 0.78, High: 0.20, Ultra: 0.02 },
  2: { Low: 0.70, High: 0.25, Ultra: 0.05 },
  3: { Low: 0.62, High: 0.30, Ultra: 0.08 },
};

// Mining damage probabilities
export const DRILL_DAMAGE_CHANCE: Record<number, number> = {
  1: 0.15,
  2: 0.15,
  3: 0.20,
};

export const BLAST_DAMAGE_CHANCE = {
  first: 0.35,
  second: 0.15,
};

// Relic cache chance (per day after mining)
export const RELIC_CACHE_CHANCE = 0.10;

// Relic weights (Loan Voucher should be 8%)
export const RELIC_WEIGHTS: Record<string, number> = {
  LoanVoucher: 8,
  DamageShield: 12,
  CreditBoost: 15,
  SpecimenBoost: 15,
  RepairDiscount: 12,
  ExtraShift: 10,
  LuckyVein: 10,
  MarketInsight: 10,
  VaultExpansion: 4,
  TimeExtension: 4,
};

// Loan Voucher penalty
export const LOAN_VOUCHER_PENALTY = 0.35; // +35% next day due

// Specimen listing constraints
export const MAX_ACTIVE_LISTINGS = 2;
export const LISTING_COOLDOWN_MINUTES = 60;
export const LISTING_FEE_RATE = 0.03; // 3%

// Market price update interval (15 minutes)
export const MARKET_UPDATE_INTERVAL_MS = 15 * 60 * 1000;

