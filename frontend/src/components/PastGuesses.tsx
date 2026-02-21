"use client";

import type { Guess } from "@/lib/types";

interface Props {
  guesses: Guess[];
}

export default function PastGuesses({ guesses }: Props) {
  if (guesses.length === 0) return null;

  return (
    <div className="w-full max-w-md">
      <p className="text-[#999980] text-sm mb-2">
        Past guesses (click to show/hide):
      </p>
      <div className="space-y-1">
        {guesses.map((g, i) => (
          <div key={i} className="flex items-center gap-2 text-sm">
            <span className="text-[#666650] w-5">{i + 1}.</span>
            <span className="text-[#d4d4c8]">{g.region_name}</span>
            <span
              className={`w-4 h-4 rounded-sm inline-block ${
                g.is_on_shortest_path ? "bg-[#d4856a]" : "bg-[#5a5a5a]"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
