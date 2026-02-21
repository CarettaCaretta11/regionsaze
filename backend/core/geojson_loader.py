import json
from pathlib import Path
from shapely.geometry import Polygon, MultiPolygon, mapping
from typing import Any

DATA_DIR = Path(__file__).parent.parent / "data"
DATA_PATH = DATA_DIR / "azerbaijan_districts.json"


def _largest_polygon(polygons_raw: list) -> tuple[Polygon, list]:
    """For MultiPolygon, keep only the polygon with the largest area.
    Returns (shapely_geom, raw_polygon_data_as_single_polygon)."""
    parts = []
    for poly_rings in polygons_raw:
        exterior = poly_rings[0]
        holes = poly_rings[1:] if len(poly_rings) > 1 else []
        parts.append((Polygon(exterior, holes), poly_rings))

    # Pick the largest by area
    largest = max(parts, key=lambda p: p[0].area)
    return largest[0], [largest[1]]


def load_regions() -> list[dict[str, Any]]:
    """Load district data and return list of region dicts with name + shapely geometry."""
    with open(DATA_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    regions = []
    for entry in data:
        name = entry["name"]
        name_en = entry.get("name_en", name)
        geom_type = entry["geometry_type"]
        polygons_raw = entry["polygons"]

        if geom_type == "MultiPolygon" and len(polygons_raw) > 1:
            geometry, polygons_simplified = _largest_polygon(polygons_raw)
        else:
            exterior = polygons_raw[0][0]
            holes = polygons_raw[0][1:] if len(polygons_raw[0]) > 1 else []
            geometry = Polygon(exterior, holes)
            polygons_simplified = polygons_raw

        if not geometry.is_valid:
            geometry = geometry.buffer(0)

        # Compute centroid for positioning on the globe
        centroid = geometry.centroid
        region_id = name_en

        regions.append({
            "id": region_id,
            "name": name,
            "name_en": name_en,
            "geometry": geometry,
            "polygons": polygons_simplified,
            "centroid": [centroid.x, centroid.y],
        })

    return regions
