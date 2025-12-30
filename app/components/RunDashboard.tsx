"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { startRun } from "@/app/actions/game";
import { DUE_CURVE } from "@/lib/game/constants";
import { RunStatus } from "@/lib/prisma-types";

interface Run {
  id: string;
  status: RunStatus;
  currentDay: number;
  credits: number;
  hp: number;
  dayStates: Array<{
    day: number;
    due: number;
    paid: boolean;
    shiftsUsed: number;
  }>;
  stashItems: Array<{
    id: string;
    metalType: string;
    units: number;
  }>;
  specimens: Array<{
    id: string;
    metalType: string;
    form: string;
    grade: string;
    biome: string;
  }>;
  ownedRelics: Array<{
    id: string;
    relicType: string;
  }>;
}

export default function RunDashboard({ run }: { run: Run | null }) {
  const [loading, setLoading] = useState(false);

  async function handleStartRun() {
    setLoading(true);
    try {
      await startRun();
      window.location.reload();
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  }

  if (!run) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-bold">Claimjumpers</h1>
            <div className="space-x-4">
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
              <Link
                href="/market"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
              >
                Market
              </Link>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
              >
                Sign Out
              </button>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">No Active Run</h2>
            <p className="text-gray-400 mb-6">
              Start a new run to begin mining. Runs last 12 days. Survive and pay all dues to win!
            </p>
            <button
              onClick={handleStartRun}
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold disabled:opacity-50"
            >
              {loading ? "Starting..." : "Start New Run"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentDayState = run.dayStates.find((d) => d.day === run.currentDay);
  const due = currentDayState?.due || DUE_CURVE[run.currentDay - 1];
  const paid = currentDayState?.paid || false;
  const shiftsUsed = currentDayState?.shiftsUsed || 0;
  const canMine = !paid && shiftsUsed < 2;

  const totalStashValue = run.stashItems.reduce((sum, item) => sum + item.units, 0);
  const hasLoanVoucher = run.ownedRelics.some((r) => r.relicType === "LoanVoucher");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Claimjumpers</h1>
          <div className="space-x-4">
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
            <Link
              href="/market"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Market
            </Link>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
            >
              Sign Out
            </button>
          </div>
        </div>

        {run.status === "Won" && (
          <div className="bg-green-900/50 border border-green-500 rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-bold text-green-300 mb-2">Run Won!</h2>
            <p className="text-green-200">You survived all 12 days. Your stash has been deposited to your Vault.</p>
            <Link href="/vault" className="text-green-300 underline mt-2 inline-block">
              View Vault →
            </Link>
          </div>
        )}

        {run.status === "Lost" && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <h2 className="text-2xl font-bold text-red-300 mb-2">Run Lost</h2>
            <p className="text-red-200">Your run has ended. All stash has been confiscated.</p>
            <button
              onClick={handleStartRun}
              disabled={loading}
              className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
            >
              Start New Run
            </button>
          </div>
        )}

        {run.status === "Active" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Day</h3>
                <p className="text-3xl font-bold">{run.currentDay} / 12</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">Credits</h3>
                <p className="text-3xl font-bold">{run.credits.toLocaleString()}</p>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-400 mb-2">HP</h3>
                <p className="text-3xl font-bold text-red-400">{run.hp} / 10</p>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Day {run.currentDay} Due</h2>
                {paid && <span className="text-green-400 font-semibold">Paid ✓</span>}
              </div>
              <p className="text-3xl font-bold mb-4">
                {due.toLocaleString()} Credits
              </p>
              {!paid && (
                <div className="space-y-2">
                  <p className={`text-lg ${run.credits >= due ? "text-green-400" : "text-red-400"}`}>
                    You have: {run.credits.toLocaleString()} Credits
                    {run.credits < due && (
                      <span className="ml-2">
                        (Short by {(due - run.credits).toLocaleString()})
                      </span>
                    )}
                  </p>
                  {hasLoanVoucher && run.credits < due && (
                    <p className="text-yellow-400 text-sm">
                      You have a Loan Voucher available
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Stash</h3>
                <div className="space-y-2">
                  <p className="text-gray-400">
                    Units: {run.stashItems.reduce((sum, item) => sum + item.units, 0)}
                  </p>
                  <p className="text-gray-400">
                    Specimens: {run.specimens.length}
                  </p>
                </div>
              </div>
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Relics</h3>
                {run.ownedRelics.length > 0 ? (
                  <div className="space-y-2">
                    {run.ownedRelics.map((relic) => (
                      <div key={relic.id} className="text-sm bg-gray-700 px-3 py-2 rounded">
                        {relic.relicType}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No relics</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              {canMine && (
                <Link
                  href="/run/mine"
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold"
                >
                  Mine ({2 - shiftsUsed} shifts left)
                </Link>
              )}
              <Link
                href="/run/inventory"
                className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold"
              >
                Inventory
              </Link>
              {!paid && (
                <Link
                  href="/run/pay"
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold"
                >
                  Pay Due
                </Link>
              )}
              {run.hp < 10 && (
                <Link
                  href="/run/repair"
                  className="px-6 py-3 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-semibold"
                >
                  Repair
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

