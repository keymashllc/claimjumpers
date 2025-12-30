import { RelicType } from "@/lib/prisma-types";
import { RELIC_WEIGHTS, LOAN_VOUCHER_PENALTY } from "./constants";

/**
 * Select a random relic based on weights
 */
export function selectRandomRelic(random: number = Math.random()): RelicType {
  const entries = Object.entries(RELIC_WEIGHTS) as [string, number][];
  const total = entries.reduce((sum, [, weight]) => sum + weight, 0);
  
  let cumulative = 0;
  for (const [relicName, weight] of entries) {
    cumulative += weight;
    if (random * total < cumulative) {
      return relicName as RelicType;
    }
  }
  
  // Fallback
  return "CreditBoost";
}

/**
 * Calculate next day due with loan voucher penalty
 */
export function applyLoanVoucherPenalty(currentDue: number): number {
  return Math.round(currentDue * (1 + LOAN_VOUCHER_PENALTY));
}

