"use client";

import Link from "next/link";

interface JournalViewProps {
  slots: any[];
}

export default function JournalView({ slots }: JournalViewProps) {
  // Group slots by page type
  const pages: Record<string, any[]> = {};
  for (const slot of slots) {
    if (!pages[slot.pageType]) {
      pages[slot.pageType] = Array(6).fill(null);
    }
    pages[slot.pageType][slot.slotIndex] = slot;
  }

  const metalPages = ["metal-SOL", "metal-AES", "metal-VIR", "metal-LUN", "metal-NOC", "metal-CRN"];
  const biomePages = ["biome-Desert", "biome-Rift", "biome-Glacier"];
  const formPages = ["form-Coin", "form-Bar", "grade-Ultra"];

  function renderPage(pageType: string, title: string) {
    const pageSlots = pages[pageType] || Array(6).fill(null);
    const filled = pageSlots.filter((s) => s && s.vaultSpecimen).length;
    const complete = filled === 6;

    return (
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">{title}</h3>
          <span className={`text-sm ${complete ? "text-green-400" : "text-gray-400"}`}>
            {filled} / 6 {complete && "✓"}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {pageSlots.map((slot, idx) => (
            <div
              key={idx}
              className={`aspect-square rounded border-2 ${
                slot && slot.vaultSpecimen
                  ? "border-green-500 bg-green-900/30"
                  : "border-gray-600 bg-gray-700/30"
              } flex items-center justify-center p-2`}
            >
              {slot && slot.vaultSpecimen ? (
                <div className="text-center text-xs">
                  <p className="font-semibold">
                    {slot.vaultSpecimen.metalType} {slot.vaultSpecimen.form}
                  </p>
                  <p className="text-gray-400">{slot.vaultSpecimen.grade}</p>
                </div>
              ) : (
                <span className="text-gray-500 text-xs">Empty</span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Journal</h1>
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
              href="/market"
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
            >
              Market
            </Link>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Metal Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {metalPages.map((pageType) => {
                const metal = pageType.split("-")[1];
                return renderPage(pageType, `${metal} Page`);
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Biome Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {biomePages.map((pageType) => {
                const biome = pageType.split("-")[1];
                return renderPage(pageType, `${biome} Page`);
              })}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Form & Grade Pages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {formPages.map((pageType) => {
                const name = pageType.startsWith("form-")
                  ? `${pageType.split("-")[1]}s Page`
                  : "Ultra Grade Page";
                return renderPage(pageType, name);
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

