from fastapi import APIRouter, Request
from models.schemas import RegionInfo

router = APIRouter(prefix="/api", tags=["regions"])


@router.get("/regions", response_model=list[RegionInfo])
async def get_all_regions(request: Request):
    """Returns all regions with their polygon data for SVG rendering."""
    regions = request.app.state.regions
    return [
        RegionInfo(
            id=r["id"],
            name=r["name"],
            name_en=r["name_en"],
            polygons=r["polygons"],
            centroid=r["centroid"],
        )
        for r in regions
    ]
