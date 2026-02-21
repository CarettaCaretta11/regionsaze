from datetime import date

from fastapi import APIRouter, HTTPException, Query, Request
from models.schemas import AdjacentsResponse, DailyPuzzle, GuessResult, SearchResult
from core.puzzle import get_daily_puzzle
from core.pathfinder import bfs_shortest_path

router = APIRouter(prefix="/api/game", tags=["game"])


@router.get("/today", response_model=DailyPuzzle)
async def get_today_puzzle(request: Request):
    """Returns today's puzzle: start region, end region, par score."""
    regions = request.app.state.regions
    adjacency = request.app.state.adjacency
    region_ids = [r["id"] for r in regions]

    start_id, end_id, par, _ = get_daily_puzzle(region_ids, adjacency)
    name_map = {r["id"]: r["name"] for r in regions}

    return DailyPuzzle(
        start_id=start_id,
        start_name=name_map[start_id],
        end_id=end_id,
        end_name=name_map[end_id],
        par=par,
        date=date.today().isoformat(),
        max_guesses=par + 4,
    )


@router.get("/guess", response_model=GuessResult)
async def guess_region(name: str, request: Request):
    """Validate a guess by region name. Fuzzy matches against name and name_en."""
    regions = request.app.state.regions
    adjacency = request.app.state.adjacency
    region_ids = [r["id"] for r in regions]

    query = name.strip().lower()
    matched = None
    for r in regions:
        if (query == r["name"].lower()
            or query == r["name_en"].lower()
            or query == r["id"].lower()):
            matched = r
            break

    if not matched:
        # Try partial match
        for r in regions:
            if (query in r["name"].lower()
                or query in r["name_en"].lower()):
                matched = r
                break

    if not matched:
        return GuessResult(valid=False, message="Rayon tapılmadı")

    # Check if this region is on the shortest path
    start_id, end_id, par, shortest_path = get_daily_puzzle(region_ids, adjacency)
    is_on_path = matched["id"] in shortest_path

    return GuessResult(
        valid=True,
        region_id=matched["id"],
        region_name=matched["name"],
        is_on_shortest_path=is_on_path,
        message="",
    )


@router.get("/search", response_model=list[SearchResult])
async def search_regions(q: str = Query(min_length=1), request: Request = None):
    """Search regions by name prefix for autocomplete."""
    regions = request.app.state.regions
    query = q.strip().lower()
    results = []
    for r in regions:
        if (query in r["name"].lower() or query in r["name_en"].lower()):
            results.append(SearchResult(
                id=r["id"],
                name=r["name"],
                name_en=r["name_en"],
            ))
        if len(results) >= 8:
            break
    return results


@router.get("/adjacents/{region_id}", response_model=AdjacentsResponse)
async def get_adjacent_regions(region_id: str, request: Request):
    """Returns list of region IDs adjacent to the given region."""
    adjacency = request.app.state.adjacency
    if region_id not in adjacency:
        raise HTTPException(status_code=404, detail=f"Region '{region_id}' not found")
    return AdjacentsResponse(
        region_id=region_id,
        adjacents=sorted(adjacency[region_id]),
    )
