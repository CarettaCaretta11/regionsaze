"use client";

import { memo, useMemo } from "react";
import type { RegionData } from "@/lib/types";
import type { BBox, ViewBox } from "@/lib/geo";
import { regionToSvgPath, centroidToSvg } from "@/lib/geo";

type RegionColor = "start" | "end" | "correct" | "wrong" | "default";

const FILL_COLORS: Record<RegionColor, string> = {
  start: "#d4856a",   // salmon/pink like travle
  end: "#6bb5a0",     // teal/mint
  correct: "#6bb5a0", // teal when on shortest path
  wrong: "#5a5a5a",   // dark grey when not on shortest path
  default: "#4a4a4a",
};

interface Props {
  region: RegionData;
  color: RegionColor;
  bbox: BBox;
  viewBox: ViewBox;
  showLabel?: boolean;
}

export default memo(function FloatingRegion({
  region,
  color,
  bbox,
  viewBox,
  showLabel = true,
}: Props) {
  const svgPath = useMemo(
    () => regionToSvgPath(region, bbox, viewBox),
    [region, bbox, viewBox],
  );

  const labelPos = useMemo(
    () => centroidToSvg(region.centroid, bbox, viewBox),
    [region.centroid, bbox, viewBox],
  );

  const fill = FILL_COLORS[color];

  return (
    <g style={{ animation: "fadeIn 0.4s ease-out" }}>
      <path
        d={svgPath}
        fill={fill}
        stroke="rgba(255,255,255,0.1)"
        strokeWidth={0.3}
      />
      {showLabel && (
        <text
          x={labelPos[0]}
          y={labelPos[1] - 15}
          textAnchor="middle"
          fill="#d4d4d4"
          fontSize={11}
          fontFamily="system-ui, sans-serif"
          fontWeight={500}
        >
          {region.name_en.replace(" District", "").replace(" City", "")}
        </text>
      )}
    </g>
  );
});
