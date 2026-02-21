import hashlib
from datetime import date

from .pathfinder import bfs_shortest_path, get_connected_component


def get_daily_puzzle(
    region_ids: list[str],
    adjacency: dict[str, set[str]],
    target_date: date | None = None,
) -> tuple[str, str, int, list[str]]:
    """
    Generate a deterministic daily puzzle based on the date.
    Returns (start_id, end_id, par, shortest_path).
    """
    if target_date is None:
        target_date = date.today()

    seed_str = f"rayonlarimiz-{target_date.isoformat()}"
    seed = int(hashlib.sha256(seed_str.encode()).hexdigest(), 16)

    # Use the largest connected component (mainland, excludes Nakhchivan exclave)
    components = []
    remaining = set(region_ids)
    while remaining:
        start = next(iter(remaining))
        comp = get_connected_component(start, adjacency)
        components.append(sorted(comp))
        remaining -= comp

    mainland = max(components, key=len)

    attempts = 0
    while True:
        idx_start = (seed + attempts) % len(mainland)
        idx_end = (seed + attempts * 7 + 13) % len(mainland)
        attempts += 1

        if idx_start == idx_end:
            continue

        start_id = mainland[idx_start]
        end_id = mainland[idx_end]

        path = bfs_shortest_path(adjacency, start_id, end_id)
        if path is None:
            continue

        par = len(path) - 2  # steps between start and end
        if 3 <= par <= 8:
            return start_id, end_id, par, path
