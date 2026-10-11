import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.services.training_service import (
    get_training_history,
    get_training_session,
    get_training_summary,
    get_training_analytics,
)


router = APIRouter(
    prefix="/training",
    tags=["Training"]
)


@router.get("/{athlete_id}")
def training_history(athlete_id: str):

    history = get_training_history(athlete_id)

    if not history:
        raise HTTPException(
            status_code=404,
            detail=f"Athlete {athlete_id} was not found."
        )

    return {
        "athlete_id": athlete_id,
        "session_count": len(history),
        "training_history": history
    }


@router.get("/{athlete_id}/summary")
def training_summary(athlete_id: str):

    summary = get_training_summary(athlete_id)

    if summary is None:
        raise HTTPException(
            status_code=404,
            detail=f"Athlete {athlete_id} was not found."
        )

    return summary


@router.get("/{athlete_id}/analytics")
def training_analytics(athlete_id: str):

    analytics = get_training_analytics(athlete_id)

    if not analytics:
        raise HTTPException(
            status_code=404,
            detail=f"Athlete {athlete_id} was not found."
        )

    return {
        "athlete_id": athlete_id,
        "records": len(analytics),
        "analytics": analytics
    }


@router.get("/{athlete_id}/session/{session_id}")
def training_session(
    athlete_id: str,
    session_id: str
):

    session = get_training_session(
        athlete_id,
        session_id
    )

    if session is None:
        raise HTTPException(
            status_code=404,
            detail=(
                f"Session {session_id} for "
                f"athlete {athlete_id} was not found."
            )
        )

    return session


@router.get("/health")
def training_health():

    return {
        "status": "ok",
        "service": "FitPulse Training API"
    }


if __name__ == "__main__":

    print("FitPulse Training API")
    print("=" * 55)

    print("API router loaded successfully.")

    print("\nAvailable endpoints:")
    print("GET /training/{athlete_id}")
    print("GET /training/{athlete_id}/summary")
    print("GET /training/{athlete_id}/analytics")
    print("GET /training/{athlete_id}/session/{session_id}")
    print("GET /training/health")

    print("\nTest athlete: A001")