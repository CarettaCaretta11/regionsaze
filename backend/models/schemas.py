from pydantic import BaseModel
from typing import Any


class RegionInfo(BaseModel):
    id: str
    name: str
    name_en: str
    polygons: Any
    centroid: list[float]


class DailyPuzzle(BaseModel):
    start_id: str
    start_name: str
    end_id: str
    end_name: str
    par: int
    date: str
    max_guesses: int


class GuessResult(BaseModel):
    valid: bool
    region_id: str | None = None
    region_name: str | None = None
    is_on_shortest_path: bool = False
    message: str = ""


class AdjacentsResponse(BaseModel):
    region_id: str
    adjacents: list[str]


class SearchResult(BaseModel):
    id: str
    name: str
    name_en: str
