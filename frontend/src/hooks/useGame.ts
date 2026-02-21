"use client";

import { useState, useCallback, useEffect } from "react";
import { fetchTodayPuzzle, submitGuess } from "@/lib/api";
import type { DailyPuzzle, Guess } from "@/lib/types";

interface GameHook {
  puzzle: DailyPuzzle | null;
  guesses: Guess[];
  won: boolean;
  lost: boolean;
  loading: boolean;
  error: string | null;
  hintsUsed: number;
  visibleRegionIds: Set<string>;
  handleGuess: (name: string) => Promise<void>;
  showNextOutline: () => void;
  showAllOutlines: () => void;
}

export function useGame(allRegionIds: string[]): GameHook {
  const [puzzle, setPuzzle] = useState<DailyPuzzle | null>(null);
  const [guesses, setGuesses] = useState<Guess[]>([]);
  const [won, setWon] = useState(false);
  const [lost, setLost] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [hintRegionIds, setHintRegionIds] = useState<string[]>([]);

  useEffect(() => {
    fetchTodayPuzzle()
      .then(setPuzzle)
      .catch(() => setError("Oyun yüklənə bilmədi"))
      .finally(() => setLoading(false));
  }, []);

  const handleGuess = useCallback(
    async (name: string) => {
      if (!puzzle || won || lost) return;

      const result = await submitGuess(name);
      if (!result.valid || !result.region_id) {
        setError(result.message || "Rayon tapılmadı");
        setTimeout(() => setError(null), 2000);
        return;
      }

      // Check duplicates
      if (guesses.some((g) => g.region_id === result.region_id)) {
        setError("Bu rayonu artıq təxmin etmisiniz");
        setTimeout(() => setError(null), 2000);
        return;
      }

      // Don't allow guessing start or end
      if (
        result.region_id === puzzle.start_id ||
        result.region_id === puzzle.end_id
      ) {
        setError("Başlanğıc və ya son rayonu təxmin edə bilməzsiniz");
        setTimeout(() => setError(null), 2000);
        return;
      }

      const newGuess: Guess = {
        region_id: result.region_id,
        region_name: result.region_name || name,
        is_on_shortest_path: result.is_on_shortest_path,
      };

      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);

      // Win if all intermediate regions on shortest path are guessed
      const correctCount = newGuesses.filter(
        (g) => g.is_on_shortest_path,
      ).length;
      if (correctCount >= puzzle.par) {
        setWon(true);
        return;
      }

      // Loss check
      if (newGuesses.length >= puzzle.max_guesses) {
        setLost(true);
      }
    },
    [puzzle, guesses, won, lost],
  );

  const showNextOutline = useCallback(() => {
    if (hintsUsed >= 3) return;
    const shown = new Set([
      ...guesses.map((g) => g.region_id),
      ...hintRegionIds,
      puzzle?.start_id,
      puzzle?.end_id,
    ]);
    const remaining = allRegionIds.filter((id) => !shown.has(id));
    if (remaining.length > 0) {
      const next = remaining[Math.floor(Math.random() * remaining.length)];
      setHintRegionIds((prev) => [...prev, next]);
      setHintsUsed((h) => h + 1);
    }
  }, [hintsUsed, guesses, hintRegionIds, allRegionIds, puzzle]);

  const showAllOutlines = useCallback(() => {
    setHintRegionIds([...allRegionIds]);
    setHintsUsed(3);
  }, [allRegionIds]);

  // Visible region IDs on the globe
  const visibleRegionIds = new Set<string>();
  if (puzzle) {
    visibleRegionIds.add(puzzle.start_id);
    visibleRegionIds.add(puzzle.end_id);
  }
  for (const g of guesses) {
    visibleRegionIds.add(g.region_id);
  }
  for (const id of hintRegionIds) {
    visibleRegionIds.add(id);
  }

  return {
    puzzle,
    guesses,
    won,
    lost,
    loading,
    error,
    hintsUsed,
    visibleRegionIds,
    handleGuess,
    showNextOutline,
    showAllOutlines,
  };
}
