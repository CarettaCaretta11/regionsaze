import type { RegionData, DailyPuzzle, GuessResult, SearchResult } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export async function fetchRegions(): Promise<RegionData[]> {
  const res = await fetch(`${API_BASE}/api/regions`);
  if (!res.ok) throw new Error("Failed to fetch regions");
  return res.json();
}

export async function fetchTodayPuzzle(): Promise<DailyPuzzle> {
  const res = await fetch(`${API_BASE}/api/game/today`);
  if (!res.ok) throw new Error("Failed to fetch puzzle");
  return res.json();
}

export async function submitGuess(name: string): Promise<GuessResult> {
  const res = await fetch(
    `${API_BASE}/api/game/guess?name=${encodeURIComponent(name)}`,
  );
  if (!res.ok) throw new Error("Failed to submit guess");
  return res.json();
}

export async function searchRegions(query: string): Promise<SearchResult[]> {
  const res = await fetch(
    `${API_BASE}/api/game/search?q=${encodeURIComponent(query)}`,
  );
  if (!res.ok) return [];
  return res.json();
}
