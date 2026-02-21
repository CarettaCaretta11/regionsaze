from shapely.geometry import Point, MultiPoint
from typing import Any


def _has_linear_component(geom) -> bool:
    """Check if geometry has any linear (edge-sharing) component, not just points."""
    if geom.is_empty:
        return False
    if isinstance(geom, (Point, MultiPoint)):
        return False
    # LineString, MultiLineString, Polygon, GeometryCollection with lines
    if geom.geom_type in ("LineString", "MultiLineString", "LinearRing"):
        return geom.length > 0
    if geom.geom_type == "GeometryCollection":
        return any(_has_linear_component(g) for g in geom.geoms)
    return False


def build_adjacency_graph(regions: list[dict[str, Any]]) -> dict[str, set[str]]:
    """
    Build adjacency graph from region geometries.
    Two regions are adjacent if their polygons share a boundary segment
    (not just a single touch point).
    """
    adjacency: dict[str, set[str]] = {r["id"]: set() for r in regions}
    n = len(regions)

    for i in range(n):
        for j in range(i + 1, n):
            geom_a = regions[i]["geometry"]
            geom_b = regions[j]["geometry"]

            # Quick bounding box rejection
            if not geom_a.intersects(geom_b) and not geom_a.touches(geom_b):
                continue

            try:
                intersection = geom_a.intersection(geom_b)
            except Exception:
                intersection = geom_a.buffer(0).intersection(geom_b.buffer(0))

            if _has_linear_component(intersection):
                adjacency[regions[i]["id"]].add(regions[j]["id"])
                adjacency[regions[j]["id"]].add(regions[i]["id"])

    return adjacency
