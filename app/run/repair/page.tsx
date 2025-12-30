"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveRun, repair } from "@/app/actions/game";
import Link from "next/link";
import { REPAIR_COST_PER_HP, STARTING_HP } from "@/lib/game/constants";

export default function RepairPage() {
  const router = useRouter();
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [repairing, setRepairing] = useState(false);
  const [hpToRepair, setHpToRepair] = useState(1);

  useEffect(() => {
    loadRun();
  }, []);

  async function loadRun() {
    try {
      const activeRun = await getActiveRun();
      setRun(activeRun);
      if (activeRun) {
        const maxRepair = STARTING_HP - activeRun.hp;
        setHpToRepair(Math.min(hpToRepair, maxRepair));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRepair() {
    if (!run) return;

    setRepairing(true);
    try {
      await repair(run.id, hpToRepair);
      await loadRun();
      alert("Repaired successfully!");
      router.push("/run");
    } catch (err: any) {
      alert(err.message);
    } finally {
      setRepairing(false);
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

  const maxRepair = STARTING_HP - run.hp;
  const cost = hpToRepair * REPAIR_COST_PER_HP;
  const canAfford = run.credits >= cost;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Repair Rig</h1>
          <Link
            href="/run"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Back
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Repair Status</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Current HP:</span>
              <span className="text-xl font-bold text-red-400">{run.hp} / {STARTING_HP}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Max Repair:</span>
              <span className="text-xl">{maxRepair} HP</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Your Credits:</span>
              <span className="text-xl">{run.credits.toLocaleString()} Credits</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Repair Options</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                HP to Repair: {hpToRepair}
              </label>
              <input
                type="range"
                min="1"
                max={maxRepair}
                value={hpToRepair}
                onChange={(e) => setHpToRepair(parseInt(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-gray-700">
              <span className="text-gray-400">Cost:</span>
              <span className={`text-2xl font-bold ${canAfford ? "text-green-400" : "text-red-400"}`}>
                {cost.toLocaleString()} Credits
              </span>
            </div>
            {!canAfford && (
              <p className="text-red-400 text-sm">Not enough credits</p>
            )}
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleRepair}
            disabled={repairing || !canAfford || hpToRepair <= 0}
            className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {repairing ? "Repairing..." : "Repair"}
          </button>
          <Link
            href="/run"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
}

