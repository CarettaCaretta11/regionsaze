"use client";

import { useEffect, useMemo, useState } from "react";
import AzerbaijanMap from "@/components/AzerbaijanMap";
import RegionInput from "@/components/RegionInput";
import PastGuesses from "@/components/PastGuesses";
import HintSection from "@/components/HintSection";
import WinModal from "@/components/WinModal";
import { useGame } from "@/hooks/useGame";
import { fetchRegions } from "@/lib/api";
import type { RegionData } from "@/lib/types";

export default function Home() {
  const [regions, setRegions] = useState<RegionData[]>([]);
  const [regionsLoading, setRegionsLoading] = useState(true);

  useEffect(() => {
    fetchRegions()
      .then(setRegions)
      .finally(() => setRegionsLoading(false));
  }, []);

  const allRegionIds = useMemo(() => regions.map((r) => r.id), [regions]);

  const game = useGame(allRegionIds);

  const hintRegionIds = useMemo(() => {
    // Extract hint region IDs (visible but not start/end/guessed)
    const guessedIds = new Set(game.guesses.map((g) => g.region_id));
    return Array.from(game.visibleRegionIds).filter(
      (id) =>
        id !== game.puzzle?.start_id &&
        id !== game.puzzle?.end_id &&
        !guessedIds.has(id),
    );
  }, [game.visibleRegionIds, game.guesses, game.puzzle]);

  if (regionsLoading || game.loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-2 border-[#5a5a3a] border-t-[#c8c8a0] rounded-full animate-spin mb-3" />
          <p className="text-[#999980]">Xəritə yüklənir...</p>
        </div>
      </main>
    );
  }

  if (game.error && !game.puzzle) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#d4856a] text-lg mb-2">{game.error}</p>
          <p className="text-[#666650] text-sm">
            Backend serverin işlədiyinə əmin olun (port 8000)
          </p>
        </div>
      </main>
    );
  }

  const gameOver = game.won || game.lost;

  return (
    <main className="min-h-screen flex flex-col items-center px-4 py-4 max-w-lg mx-auto">
      {/* Header — travle style */}
      {game.puzzle && (
        <p className="text-center text-[#d4d4c8] mb-4">
          Today I&apos;d like to{" "}
          <span className="font-bold">travle</span> from{" "}
          <span className="text-[#d4856a] font-semibold">
            {game.puzzle.start_name}
          </span>{" "}
          to{" "}
          <span className="text-[#6bb5a0] font-semibold">
            {game.puzzle.end_name}
          </span>
        </p>
      )}

      {/* Globe map with floating regions */}
      {game.puzzle && (
        <AzerbaijanMap
          regions={regions}
          visibleRegionIds={game.visibleRegionIds}
          startId={game.puzzle.start_id}
          endId={game.puzzle.end_id}
          guesses={game.guesses}
          hintRegionIds={hintRegionIds}
          showAllOutlines={game.hintsUsed >= 3}
        />
      )}

      {/* Error toast */}
      {game.error && game.puzzle && (
        <div className="text-[#d4856a] text-sm mb-2 animate-pulse">
          {game.error}
        </div>
      )}

      {/* Input */}
      {game.puzzle && (
        <div className="w-full mt-2 mb-4">
          <RegionInput
            onSubmit={game.handleGuess}
            guessNumber={game.guesses.length + 1}
            maxGuesses={game.puzzle.max_guesses}
            disabled={gameOver}
          />
        </div>
      )}

      {/* Past guesses */}
      <PastGuesses guesses={game.guesses} />

      {/* Hints */}
      {game.puzzle && !gameOver && (
        <div className="mt-4 w-full">
          <HintSection
            hintsUsed={game.hintsUsed}
            maxHints={3}
            onShowNextOutline={game.showNextOutline}
            onShowAllOutlines={game.showAllOutlines}
            disabled={gameOver}
          />
        </div>
      )}

      {/* Win/Loss modal */}
      {game.puzzle && (
        <WinModal
          won={game.won}
          lost={game.lost}
          guesses={game.guesses}
          par={game.puzzle.par}
          startName={game.puzzle.start_name}
          endName={game.puzzle.end_name}
          date={game.puzzle.date}
        />
      )}

      {/* Watermark */}
      <p className="mt-6 text-[#3a3a30] text-xs">rayonlarimiz</p>
    </main>
  );
}
