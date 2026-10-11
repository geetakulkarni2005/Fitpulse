import sys
from pathlib import Path

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Optional


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.services.recommendation_service import get_recommendation


router = APIRouter(
    prefix="/recommendations",
    tags=["Recommendations"]
)


class RecommendationRequest(BaseModel):
    risk_level: str
    contributing_features: Optional[List[str]] = []
    symptoms: Optional[List[str]] = []
    top_k: int = 5


@router.post("/")
def create_recommendation(request: RecommendationRequest):

    result = get_recommendation(
        risk_level=request.risk_level,
        contributing_features=request.contributing_features,
        symptoms=request.symptoms,
        top_k=request.top_k
    )

    return result


@router.get("/health")
def recommendation_health():

    return {
        "status": "ok",
        "service": "FitPulse Recommendation API"
    }


if __name__ == "__main__":
    print("FitPulse Recommendation API")
    print("=" * 55)
    print("API router loaded successfully.")
    print("Available endpoints:")
    print("POST /recommendations/")
    print("GET  /recommendations/health")