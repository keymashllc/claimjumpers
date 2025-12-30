import { MetalType } from "@/lib/prisma-types";
import { BASE_PRICES, BID_MULTIPLIER, ASK_MULTIPLIER } from "./constants";

/**
 * Calculate bid price (sell price) with spread
 */
export function getBidPrice(basePrice: number): number {
  return basePrice * BID_MULTIPLIER;
}

/**
 * Calculate ask price (buy price) with spread
 */
export function getAskPrice(basePrice: number): number {
  return basePrice * ASK_MULTIPLIER;
}

/**
 * Simple random walk for market price updates
 * Returns new price based on current price with ±2% change
 */
export function updateMarketPrice(currentPrice: number, random: number = Math.random()): number {
  // Random walk: ±2% change
  const changePercent = (random - 0.5) * 0.04; // -2% to +2%
  const newPrice = currentPrice * (1 + changePercent);
  // Ensure price doesn't go below 10% of base
  return Math.max(newPrice, currentPrice * 0.1);
}

/**
 * Get current market price for a metal (with sector variation)
 * For MVP, we'll use base price with simple sector multiplier
 */
export function getMarketPrice(
  metalType: MetalType,
  sectorMultiplier: number = 1.0
): number {
  return BASE_PRICES[metalType] * sectorMultiplier;
}

