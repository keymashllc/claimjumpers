"use client";

import Link from "next/link";

interface VaultViewProps {
  vault: {
    balance: any;
    specimens: any[];
  };
}

export default function VaultView({ vault }: VaultViewProps) {
  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Vault</h1>
          <div className="space-x-4">
            <Link
              href="/run"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Run
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
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Credits</h2>
            <p className="text-3xl font-bold">{vault.balance?.credits?.toLocaleString() || 0}</p>
          </div>
          <div className="bg-gray-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Units</h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>SOL:</span>
                <span>{vault.balance?.solUnits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>AES:</span>
                <span>{vault.balance?.aesUnits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>VIR:</span>
                <span>{vault.balance?.virUnits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>LUN:</span>
                <span>{vault.balance?.lunUnits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>NOC:</span>
                <span>{vault.balance?.nocUnits || 0}</span>
              </div>
              <div className="flex justify-between">
                <span>CRN:</span>
                <span>{vault.balance?.crnUnits || 0}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Specimens ({vault.specimens.length})</h2>
          {vault.specimens.length === 0 ? (
            <p className="text-gray-400">No specimens in vault</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vault.specimens.map((specimen) => (
                <div key={specimen.id} className="bg-gray-700 rounded p-4">
                  <p className="font-semibold">{specimen.metalType} {specimen.form}</p>
                  <p className="text-sm text-gray-400">
                    {specimen.grade} Grade • {specimen.biome}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Deposited: {new Date(specimen.depositedAt).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

