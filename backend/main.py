import sys
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# Add backend to path so imports work when running from backend dir
sys.path.insert(0, str(Path(__file__).parent))

from core.geojson_loader import load_regions
from core.adjacency import build_adjacency_graph
from api.game import router as game_router
from api.regions import router as regions_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: load regions and build adjacency graph
    print("Loading GeoJSON data...")
    regions = load_regions()
    print(f"Loaded {len(regions)} regions")

    print("Building adjacency graph...")
    adjacency = build_adjacency_graph(regions)
    total_edges = sum(len(v) for v in adjacency.values()) // 2
    print(f"Built adjacency graph with {total_edges} edges")

    app.state.regions = regions
    app.state.adjacency = adjacency

    yield


app = FastAPI(title="Rayonlarimiz API", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(game_router)
app.include_router(regions_router)
