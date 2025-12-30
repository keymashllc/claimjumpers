"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MARKET_UPDATE_INTERVAL_MS = exports.LISTING_FEE_RATE = exports.LISTING_COOLDOWN_MINUTES = exports.MAX_ACTIVE_LISTINGS = exports.LOAN_VOUCHER_PENALTY = exports.RELIC_WEIGHTS = exports.RELIC_CACHE_CHANCE = exports.BLAST_DAMAGE_CHANCE = exports.DRILL_DAMAGE_CHANCE = exports.GRADE_DISTRIBUTION = exports.GRADE_MULTIPLIERS = exports.FORM_BASE_UNITS = exports.VEIN_EV = exports.SPECIMEN_CHANCE = exports.BIOME_METAL_WEIGHTS = exports.VEINS_PER_SHIFT = exports.SHIFTS_PER_DAY = exports.STARTING_HP = exports.REPAIR_COST_PER_HP = exports.ASK_MULTIPLIER = exports.BID_MULTIPLIER = exports.BASE_PRICES = exports.DUE_CURVE = void 0;
// Daily payment curve (Credits)
exports.DUE_CURVE = [250, 330, 430, 560, 730, 950, 1240, 1620, 2120, 2770, 3620, 4740];
// Base metal prices (Credits per unit)
exports.BASE_PRICES = {
    SOL: 20,
    AES: 28,
    VIR: 26,
    LUN: 32,
    NOC: 55,
    CRN: 180,
};
// Commodity spread: 2% total (1% each side)
exports.BID_MULTIPLIER = 0.99;
exports.ASK_MULTIPLIER = 1.01;
// Repair cost per damage point
exports.REPAIR_COST_PER_HP = 180;
// Starting HP
exports.STARTING_HP = 10;
// Shifts per day
exports.SHIFTS_PER_DAY = 2;
exports.VEINS_PER_SHIFT = 3;
// Biome metal weights (percentages)
exports.BIOME_METAL_WEIGHTS = {
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
exports.SPECIMEN_CHANCE = {
    1: 0.08,
    2: 0.14,
    3: 0.22,
};
// Expected values per vein (before spread/repairs)
exports.VEIN_EV = {
    1: { drill: 190, blast: 230 },
    2: { drill: 270, blast: 330 },
    3: { drill: 360, blast: 450 },
};
// Specimen form base units
exports.FORM_BASE_UNITS = {
    Ore: 4,
    Nugget: 6,
    Coin: 7,
    Bar: 8,
};
// Grade multipliers
exports.GRADE_MULTIPLIERS = {
    Low: 1.0,
    High: 1.5,
    Ultra: 2.3,
};
// Grade distribution within specimens by depth
exports.GRADE_DISTRIBUTION = {
    1: { Low: 0.78, High: 0.20, Ultra: 0.02 },
    2: { Low: 0.70, High: 0.25, Ultra: 0.05 },
    3: { Low: 0.62, High: 0.30, Ultra: 0.08 },
};
// Mining damage probabilities
exports.DRILL_DAMAGE_CHANCE = {
    1: 0.15,
    2: 0.15,
    3: 0.20,
};
exports.BLAST_DAMAGE_CHANCE = {
    first: 0.35,
    second: 0.15,
};
// Relic cache chance (per day after mining)
exports.RELIC_CACHE_CHANCE = 0.10;
// Relic weights (Loan Voucher should be 8%)
exports.RELIC_WEIGHTS = {
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
exports.LOAN_VOUCHER_PENALTY = 0.35; // +35% next day due
// Specimen listing constraints
exports.MAX_ACTIVE_LISTINGS = 2;
exports.LISTING_COOLDOWN_MINUTES = 60;
exports.LISTING_FEE_RATE = 0.03; // 3%
// Market price update interval (15 minutes)
exports.MARKET_UPDATE_INTERVAL_MS = 15 * 60 * 1000;
