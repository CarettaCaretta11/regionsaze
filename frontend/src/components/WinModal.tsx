"use client";

import { useState } from "react";
import type { Guess } from "@/lib/types";

interface Props {
  won: boolean;
  lost: boolean;
  guesses: Guess[];
  par: number;
  startName: string;
  endName: string;
  date: string;
}

export default function WinModal({
  won,
  lost,
  guesses,
  par,
  startName,
  endName,
  date,
}: Props) {
  const [copied, setCopied] = useState(false);

  if (!won && !lost) return null;

  const correctCount = guesses.filter((g) => g.is_on_shortest_path).length;

  const title = won
    ? correctCount === guesses.length
      ? "Mükəmməl!"
      : guesses.length <= par + 2
        ? "Əla!"
        : "Təbriklər!"
    : "Oyun bitdi";

  const shareText = [
    `Rayonlarimiz ${date}`,
    `${startName} -> ${endName}`,
    `${guesses.length} guess${guesses.length === 1 ? "" : "es"} (Par: ${par})`,
    guesses.map((g) => (g.is_on_shortest_path ? "🟧" : "⬛")).join(""),
    "",
    "rayonlarimiz.az",
  ].join("\n");

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div
        className="bg-[#2a2a24] border border-[#4a4a3a] rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl"
        style={{ animation: "fadeInUp 0.3s ease-out" }}
      >
        <h2 className="text-2xl font-bold text-[#d4d4c8] mb-2">{title}</h2>
        <p className="text-[#999980] text-sm mb-4">
          {startName} → {endName}
        </p>

        <div className="flex justify-center gap-8 mb-4">
          <div>
            <div className="text-3xl font-bold text-[#d4d4c8]">
              {guesses.length}
            </div>
            <div className="text-xs text-[#999980]">Təxminlər</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-[#d4d4c8]">{par}</div>
            <div className="text-xs text-[#999980]">Par</div>
          </div>
        </div>

        <div className="flex justify-center gap-1 mb-4">
          {guesses.map((g, i) => (
            <div
              key={i}
              className={`w-6 h-6 rounded-sm ${
                g.is_on_shortest_path ? "bg-[#d4856a]" : "bg-[#5a5a5a]"
              }`}
            />
          ))}
        </div>

        <button
          onClick={handleShare}
          className="w-full py-3 rounded-xl bg-[#6bb5a0] hover:bg-[#5da592] text-[#1a1a16] font-medium transition-colors"
        >
          {copied ? "Kopyalandi!" : "Paylash"}
        </button>
      </div>
    </div>
  );
}
