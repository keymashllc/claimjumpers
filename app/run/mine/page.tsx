"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getActiveRun, mine as mineAction } from "@/app/actions/game";
import { useGameStore } from "@/lib/store";
import { Biome } from "@/lib/prisma-types";
import Link from "next/link";

export default function MinePage() {
  const router = useRouter();
  const { selectedBiome, selectedDepth, selectedMode, setSelectedBiome, setSelectedDepth, setSelectedMode } = useGameStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function handleMine() {
    if (!selectedBiome || !selectedDepth || !selectedMode) {
      alert("Please select biome, depth, and mode");
      return;
    }

    setLoading(true);
    try {
      const run = await getActiveRun();
      if (!run) {
        alert("No active run");
        router.push("/run");
        return;
      }

      const mineResult = await mineAction(run.id, selectedBiome as Biome, selectedDepth, selectedMode);
      setResult(mineResult);
      
      if (mineResult.newHp === 0) {
        setTimeout(() => {
          router.push("/run");
        }, 3000);
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  const biomes: Biome[] = ["Desert", "Rift", "Glacier"];
  const biomeInfo = {
    Desert: "SOL 50%, LUN 30%, AES 15%, VIR 5%",
    Rift: "VIR 40%, AES 30%, NOC 20%, LUN 10%",
    Glacier: "SOL 40%, LUN 35%, AES 15%, VIR 9%, CRN 1%",
  };

  if (result) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Mining Results</h1>
          
          {result.newHp === 0 && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
              <h2 className="text-2xl font-bold text-red-300">HP Reached 0!</h2>
              <p className="text-red-200">Your run has ended.</p>
            </div>
          )}

          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4">Veins Mined</h2>
            <div className="space-y-4">
              {result.result.veins.map((vein: any, idx: number) => (
                <div key={idx} className="bg-gray-700 rounded p-4">
                  {vein.isSpecimen ? (
                    <div>
                      <p className="text-green-400 font-semibold">Specimen Found!</p>
                      <p>Metal: {vein.specimen.metalType}</p>
                      <p>Form: {vein.specimen.form}</p>
                      <p>Grade: {vein.specimen.grade}</p>
                      <p>Biome: {vein.specimen.biome}</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-blue-400 font-semibold">Units Bundle</p>
                      <p>Metal: {vein.metalType}</p>
                      <p>Units: {vein.units}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {result.result.damage > 0 && (
            <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
              <p className="text-red-300">Took {result.result.damage} damage!</p>
              <p className="text-red-200">HP: {result.newHp} / 10</p>
            </div>
          )}

          <div className="flex gap-4">
            <Link
              href="/run/inventory"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
            >
              View Inventory
            </Link>
            <button
              onClick={() => {
                setResult(null);
                setSelectedBiome(null);
                setSelectedDepth(null);
                setSelectedMode(null);
              }}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
            >
              Mine Again
            </button>
            <Link
              href="/run"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Mine</h1>
          <Link
            href="/run"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Back
          </Link>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Select Biome</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {biomes.map((biome) => (
                <button
                  key={biome}
                  onClick={() => setSelectedBiome(biome)}
                  className={`p-4 rounded-lg border-2 ${
                    selectedBiome === biome
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <h3 className="font-bold text-lg mb-2">{biome}</h3>
                  <p className="text-sm text-gray-400">{biomeInfo[biome]}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Select Depth</h2>
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map((depth) => (
                <button
                  key={depth}
                  onClick={() => setSelectedDepth(depth as 1 | 2 | 3)}
                  className={`p-4 rounded-lg border-2 ${
                    selectedDepth === depth
                      ? "border-blue-500 bg-blue-900/30"
                      : "border-gray-600 hover:border-gray-500"
                  }`}
                >
                  <h3 className="font-bold text-lg">Depth {depth}</h3>
                  <p className="text-sm text-gray-400 mt-2">
                    Specimen: {depth === 1 ? "8%" : depth === 2 ? "14%" : "22%"}
                  </p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Select Mode</h2>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setSelectedMode("drill")}
                className={`p-4 rounded-lg border-2 ${
                  selectedMode === "drill"
                    ? "border-blue-500 bg-blue-900/30"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <h3 className="font-bold text-lg mb-2">Drill</h3>
                <p className="text-sm text-gray-400">
                  Damage: {selectedDepth === 3 ? "20%" : "15%"} chance
                </p>
              </button>
              <button
                onClick={() => setSelectedMode("blast")}
                className={`p-4 rounded-lg border-2 ${
                  selectedMode === "blast"
                    ? "border-blue-500 bg-blue-900/30"
                    : "border-gray-600 hover:border-gray-500"
                }`}
              >
                <h3 className="font-bold text-lg mb-2">Blast</h3>
                <p className="text-sm text-gray-400">
                  Damage: 35% chance (1 dmg) + 15% chance (2 dmg)
                </p>
              </button>
            </div>
          </div>

          <button
            onClick={handleMine}
            disabled={loading || !selectedBiome || !selectedDepth || !selectedMode}
            className="w-full px-6 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Mining..." : "Start Mining Shift"}
          </button>
        </div>
      </div>
    </div>
  );
}

