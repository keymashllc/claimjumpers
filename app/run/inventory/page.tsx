"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveRun, processDrop } from "@/app/actions/game";
import Link from "next/link";
import { getBidPrice, getMarketPrice } from "@/lib/game/market";
import { calculateSpecimenUnits } from "@/lib/game/mining";
import { SpecimenForm, SpecimenGrade } from "@/lib/prisma-types";

export default function InventoryPage() {
  const router = useRouter();
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    loadRun();
  }, []);

  async function loadRun() {
    try {
      const activeRun = await getActiveRun();
      setRun(activeRun);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAction(itemId: string, itemType: "stash" | "specimen", action: "keep" | "melt" | "sell") {
    if (!run) return;

    setProcessing(itemId);
    try {
      await processDrop(run.id, itemId, itemType, action);
      await loadRun();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setProcessing(null);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">Loading...</div>
      </div>
    );
  }

  if (!run) {
    router.push("/run");
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Inventory</h1>
          <Link
            href="/run"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Units (Stash Items)</h2>
            {run.stashItems.length === 0 ? (
              <p className="text-gray-400">No units in stash</p>
            ) : (
              <div className="space-y-3">
                {run.stashItems.map((item: any) => {
                  const basePrice = getMarketPrice(item.metalType);
                  const bidPrice = getBidPrice(basePrice);
                  const sellValue = Math.round(item.units * bidPrice);
                  
                  return (
                    <div key={item.id} className="bg-gray-700 rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{item.metalType}</p>
                          <p className="text-sm text-gray-400">{item.units} units</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Sell value:</p>
                          <p className="font-semibold">{sellValue.toLocaleString()} Credits</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(item.id, "stash", "sell")}
                          disabled={processing === item.id}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50"
                        >
                          {processing === item.id ? "Selling..." : "Sell"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Specimens</h2>
            {run.specimens.length === 0 ? (
              <p className="text-gray-400">No specimens in stash</p>
            ) : (
              <div className="space-y-3">
                {run.specimens.map((specimen: any) => {
                  const units = calculateSpecimenUnits(specimen.form as SpecimenForm, specimen.grade as SpecimenGrade);
                  const basePrice = getMarketPrice(specimen.metalType);
                  const bidPrice = getBidPrice(basePrice);
                  const meltValue = Math.round(units * bidPrice);
                  
                  return (
                    <div key={specimen.id} className="bg-gray-700 rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold">{specimen.metalType} {specimen.form}</p>
                          <p className="text-sm text-gray-400">
                            {specimen.grade} Grade • {specimen.biome}
                          </p>
                          <p className="text-sm text-gray-400 mt-1">
                            Melt: {units} units
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-400">Melt & Sell:</p>
                          <p className="font-semibold">{meltValue.toLocaleString()} Credits</p>
                        </div>
                      </div>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => handleAction(specimen.id, "specimen", "melt")}
                          disabled={processing === specimen.id}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm disabled:opacity-50"
                        >
                          {processing === specimen.id ? "Melting..." : "Melt"}
                        </button>
                        <button
                          onClick={() => handleAction(specimen.id, "specimen", "sell")}
                          disabled={processing === specimen.id}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-sm disabled:opacity-50"
                        >
                          {processing === specimen.id ? "Selling..." : "Melt & Sell"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

