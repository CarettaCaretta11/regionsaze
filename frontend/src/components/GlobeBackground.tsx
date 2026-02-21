"use client";

/** Renders curved grid lines to simulate a 3D globe behind the map */
export default function GlobeBackground() {
  // Generate latitude and longitude arcs
  const arcs: string[] = [];

  // Horizontal arcs (latitude lines) — curved
  for (let i = -2; i <= 2; i++) {
    const cy = 300 + i * 120;
    const rx = 380 + Math.abs(i) * 20;
    const ry = 40 + Math.abs(i) * 15;
    arcs.push(
      `M${240 - rx},${cy} A${rx},${ry} 0 0,1 ${240 + rx},${cy}`,
    );
  }

  // Vertical arcs (longitude lines) — curved
  for (let i = -3; i <= 3; i++) {
    const cx = 240 + i * 80;
    const rx = 30 + Math.abs(i) * 8;
    const ry = 320;
    arcs.push(
      `M${cx},${300 - ry} A${rx},${ry} 0 0,${i >= 0 ? 1 : 0} ${cx},${300 + ry}`,
    );
  }

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 480 600"
      preserveAspectRatio="xMidYMid slice"
    >
      {arcs.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.04)"
          strokeWidth={1}
        />
      ))}
      {/* Outer globe circle */}
      <ellipse
        cx={240}
        cy={300}
        rx={360}
        ry={360}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={1.5}
      />
    </svg>
  );
}
