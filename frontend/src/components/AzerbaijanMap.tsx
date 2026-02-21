"use client";

import { useMemo } from "react";
import { computeBBox } from "@/lib/geo";
import FloatingRegion from "./FloatingRegion";
import GlobeBackground from "./GlobeBackground";
import type { RegionData, Guess } from "@/lib/types";

const VB_WIDTH = 1000;
const VB_HEIGHT = 600;

interface Props {
  regions: RegionData[];
  visibleRegionIds: Set<string>;
  startId: string;
  endId: string;
  guesses: Guess[];
  hintRegionIds: string[];
  showAllOutlines: boolean;
}

export default function AzerbaijanMap({
  regions,
  visibleRegionIds,
  startId,
  endId,
  guesses,
  showAllOutlines,
}: Props) {
  const bbox = useMemo(() => computeBBox(regions), [regions]);
  const viewBox = useMemo(() => ({ width: VB_WIDTH, height: VB_HEIGHT }), []);

  const guessMap = useMemo(() => {
    const m = new Map<string, Guess>();
    for (const g of guesses) {
      m.set(g.region_id, g);
    }
    return m;
  }, [guesses]);

  const getColor = (id: string) => {
    if (id === startId) return "start" as const;
    if (id === endId) return "end" as const;
    const guess = guessMap.get(id);
    if (guess) {
      return guess.is_on_shortest_path
        ? ("correct" as const)
        : ("wrong" as const);
    }
    return "default" as const;
  };

  return (
    <div className="relative w-full max-w-lg mx-auto" style={{ minHeight: 350 }}>
      <GlobeBackground />
      <svg
        viewBox={`0 0 ${VB_WIDTH} ${VB_HEIGHT}`}
        className="relative w-full h-auto z-10"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Show all outlines faintly if hint activated */}
        {showAllOutlines &&
          regions.map((region) =>
            !visibleRegionIds.has(region.id) ? (
              <FloatingRegion
                key={`outline-${region.id}`}
                region={region}
                color="default"
                bbox={bbox}
                viewBox={viewBox}
                showLabel={false}
              />
            ) : null,
          )}

        {/* Visible regions: start, end, guessed, hinted */}
        {regions
          .filter((r) => visibleRegionIds.has(r.id))
          .map((region) => (
            <FloatingRegion
              key={region.id}
              region={region}
              color={getColor(region.id)}
              bbox={bbox}
              viewBox={viewBox}
              showLabel={true}
            />
          ))}
      </svg>
    </div>
  );
}
