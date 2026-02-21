"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { searchRegions } from "@/lib/api";
import type { SearchResult } from "@/lib/types";

interface Props {
  onSubmit: (name: string) => void;
  guessNumber: number;
  maxGuesses: number;
  disabled: boolean;
}

export default function RegionInput({
  onSubmit,
  guessNumber,
  maxGuesses,
  disabled,
}: Props) {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setValue(v);
    setSelectedIdx(-1);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (v.trim().length >= 1) {
      debounceRef.current = setTimeout(async () => {
        const results = await searchRegions(v.trim());
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      }, 150);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSubmit = useCallback(
    (name?: string) => {
      const submitName = name || value.trim();
      if (!submitName || disabled) return;
      onSubmit(submitName);
      setValue("");
      setSuggestions([]);
      setShowSuggestions(false);
    },
    [value, disabled, onSubmit],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIdx((i) => Math.min(i + 1, suggestions.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIdx((i) => Math.max(i - 1, -1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIdx >= 0 && suggestions[selectedIdx]) {
          handleSubmit(suggestions[selectedIdx].name);
        } else {
          handleSubmit();
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
      }
    },
    [suggestions, selectedIdx, handleSubmit],
  );

  return (
    <div className="relative w-full max-w-md">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={disabled}
          placeholder="Rayon adı daxil edin..."
          className="flex-1 bg-transparent border border-[#5a5a3a] rounded-lg px-4 py-2.5 text-[#d4d4c8] placeholder-[#666650] focus:outline-none focus:border-[#8a8a5a] transition-colors"
        />
        <button
          onClick={() => handleSubmit()}
          disabled={disabled || !value.trim()}
          className="px-4 py-2.5 rounded-lg border border-[#5a5a3a] text-[#c8c8a0] hover:bg-[#3a3a2a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium whitespace-nowrap"
        >
          Guess ({guessNumber}/{maxGuesses})
        </button>
      </div>

      {/* Autocomplete dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-12 mt-1 bg-[#2a2a24] border border-[#4a4a3a] rounded-lg overflow-hidden z-50 shadow-xl">
          {suggestions.map((s, i) => (
            <button
              key={s.id}
              onMouseDown={() => handleSubmit(s.name)}
              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                i === selectedIdx
                  ? "bg-[#3a3a30] text-white"
                  : "text-[#c8c8a0] hover:bg-[#333328]"
              }`}
            >
              <span>{s.name}</span>
              <span className="text-[#666650] ml-2 text-xs">{s.name_en}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
