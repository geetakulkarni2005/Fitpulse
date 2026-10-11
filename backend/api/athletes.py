import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.services.athlete_service import (
    get_all_athletes,
    get_athlete,
)


router = APIRouter(
    prefix="/athletes",
    tags=["Athletes"]
)


@router.get("/")
def list_athletes():
    """
    Return all athletes available in FitPulse.
    """
    athletes = get_all_athletes()

    return {
        "count": len(athletes),
        "athletes": athletes
    }


@router.get("/{athlete_id}")
def athlete_details(athlete_id: str):
    """
    Return details for one athlete.
    """
    athlete = get_athlete(athlete_id)

    if athlete is None:
        raise HTTPException(
            status_code=404,
            detail=f"Athlete '{athlete_id}' not found."
        )

    return athlete


@router.get("/health")
def athlete_health():
    return {
        "status": "ok",
        "service": "FitPulse Athlete API"
    }


if __name__ == "__main__":
    print("FitPulse Athlete API")
    print("=" * 55)
    print("API router loaded successfully.")

    print("\nAvailable endpoints:")
    print("GET /athletes/")
    print("GET /athletes/{athlete_id}")
    print("GET /athletes/health")