"use client";

import Link from "next/link";
import { BASE_PRICES, BID_MULTIPLIER, ASK_MULTIPLIER } from "@/lib/game/constants";
import { MetalType } from "@/lib/prisma-types";

export default function MarketPage() {
  // For MVP, we'll just show base prices with spread
  // In a full implementation, this would fetch from MarketPriceSnapshot

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Market</h1>
          <div className="space-x-4">
            <Link
              href="/run"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Run
            </Link>
            <Link
              href="/vault"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Vault
            </Link>
            <Link
              href="/journal"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Journal
            </Link>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Commodity Prices</h2>
          <p className="text-sm text-gray-400 mb-4">
            Prices update every 15 minutes. Spread: 2% (Bid = 99%, Ask = 101%)
          </p>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-3">Metal</th>
                  <th className="text-right p-3">Base Price</th>
                  <th className="text-right p-3">Bid (Sell)</th>
                  <th className="text-right p-3">Ask (Buy)</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(BASE_PRICES).map(([metal, basePrice]) => {
                  const bid = basePrice * BID_MULTIPLIER;
                  const ask = basePrice * ASK_MULTIPLIER;
                  return (
                    <tr key={metal} className="border-b border-gray-700">
                      <td className="p-3 font-semibold">{metal}</td>
                      <td className="p-3 text-right">{basePrice.toFixed(2)}</td>
                      <td className="p-3 text-right text-green-400">{bid.toFixed(2)}</td>
                      <td className="p-3 text-right text-red-400">{ask.toFixed(2)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Specimen Marketplace</h2>
          <p className="text-gray-400">
            MVP: Specimen marketplace coming soon. For now, you can only sell specimens during runs.
          </p>
        </div>
      </div>
    </div>
  );
}

