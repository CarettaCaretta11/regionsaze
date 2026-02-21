export interface RegionData {
  id: string;
  name: string;
  name_en: string;
  polygons: number[][][][];
  centroid: [number, number];
}

export interface DailyPuzzle {
  start_id: string;
  start_name: string;
  end_id: string;
  end_name: string;
  par: number;
  date: string;
  max_guesses: number;
}

export interface GuessResult {
  valid: boolean;
  region_id: string | null;
  region_name: string | null;
  is_on_shortest_path: boolean;
  message: string;
}

export interface SearchResult {
  id: string;
  name: string;
  name_en: string;
}

export interface Guess {
  region_id: string;
  region_name: string;
  is_on_shortest_path: boolean;
}
