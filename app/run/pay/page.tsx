"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getActiveRun, payDue } from "@/app/actions/game";
import Link from "next/link";

export default function PayPage() {
  const router = useRouter();
  const [run, setRun] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [useLoanVoucher, setUseLoanVoucher] = useState(false);

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

  async function handlePay() {
    if (!run) return;

    setPaying(true);
    try {
      const result = await payDue(run.id, useLoanVoucher);
      if (result.won) {
        alert("Congratulations! You won the run! Your stash has been deposited to your Vault.");
        router.push("/run");
      } else if (result.lost) {
        alert(`Run lost! You were short by ${result.shortfall?.toLocaleString()} Credits.`);
        router.push("/run");
      } else {
        alert(`Day ${result.nextDay} started!`);
        router.push("/run");
      }
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPaying(false);
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

  const currentDayState = run.dayStates.find((d: any) => d.day === run.currentDay);
  const due = currentDayState?.due || 0;
  const shortfall = due - run.credits;
  const canPay = run.credits >= due;
  const hasLoanVoucher = run.ownedRelics.some((r: any) => r.relicType === "LoanVoucher");

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Pay Day {run.currentDay} Due</h1>
          <Link
            href="/run"
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
          >
            Back
          </Link>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="text-gray-400">Due Amount:</span>
              <span className="text-2xl font-bold">{due.toLocaleString()} Credits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Your Credits:</span>
              <span className="text-xl">{run.credits.toLocaleString()} Credits</span>
            </div>
            <div className="border-t border-gray-700 pt-4">
              {canPay ? (
                <div className="flex justify-between items-center">
                  <span className="text-green-400 font-semibold">Status:</span>
                  <span className="text-green-400 font-semibold">Can Pay ✓</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-red-400 font-semibold">Status:</span>
                    <span className="text-red-400 font-semibold">
                      Short by {shortfall.toLocaleString()} Credits
                    </span>
                  </div>
                  {hasLoanVoucher && (
                    <div className="mt-4 p-4 bg-yellow-900/30 border border-yellow-600 rounded">
                      <label className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={useLoanVoucher}
                          onChange={(e) => setUseLoanVoucher(e.target.checked)}
                          className="w-5 h-5"
                        />
                        <span className="text-yellow-300">
                          Use Loan Voucher (covers shortfall, +35% penalty on next day)
                        </span>
                      </label>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {!canPay && !useLoanVoucher && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-6">
            <h3 className="text-xl font-bold text-red-300 mb-2">Warning!</h3>
            <p className="text-red-200">
              If you cannot pay the full due, your run will end and ALL stash will be confiscated.
            </p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={handlePay}
            disabled={paying || (!canPay && !useLoanVoucher)}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paying ? "Paying..." : canPay ? "Pay Due" : useLoanVoucher ? "Pay with Loan Voucher" : "Cannot Pay"}
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

