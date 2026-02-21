import type { RegionData } from "./types";

export interface BBox {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface ViewBox {
  width: number;
  height: number;
}

const PADDING = 20;

function coordToSvg(
  coord: [number, number],
  bbox: BBox,
  vb: ViewBox,
): [number, number] {
  const [x, y] = coord;
  const svgX =
    PADDING +
    ((x - bbox.minX) / (bbox.maxX - bbox.minX)) * (vb.width - 2 * PADDING);
  const svgY =
    PADDING +
    ((bbox.maxY - y) / (bbox.maxY - bbox.minY)) * (vb.height - 2 * PADDING);
  return [Math.round(svgX * 100) / 100, Math.round(svgY * 100) / 100];
}

function ringToPath(ring: number[][], bbox: BBox, vb: ViewBox): string {
  const points = ring.map((c) => coordToSvg(c as [number, number], bbox, vb));
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return (
    `M${first[0]},${first[1]}` +
    rest.map(([x, y]) => `L${x},${y}`).join("") +
    "Z"
  );
}

export function regionToSvgPath(
  region: RegionData,
  bbox: BBox,
  vb: ViewBox,
): string {
  const polys = region.polygons as number[][][][];
  return polys
    .flatMap((polygon) => polygon.map((ring) => ringToPath(ring, bbox, vb)))
    .join(" ");
}

export function computeBBox(regions: RegionData[]): BBox {
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  for (const region of regions) {
    for (const polygon of region.polygons) {
      for (const ring of polygon) {
        for (const c of ring) {
          if (c[0] < minX) minX = c[0];
          if (c[0] > maxX) maxX = c[0];
          if (c[1] < minY) minY = c[1];
          if (c[1] > maxY) maxY = c[1];
        }
      }
    }
  }

  return { minX, maxX, minY, maxY };
}

/** Convert a centroid from data coords to SVG viewport coords */
export function centroidToSvg(
  centroid: [number, number],
  bbox: BBox,
  vb: ViewBox,
): [number, number] {
  return coordToSvg(centroid, bbox, vb);
}
