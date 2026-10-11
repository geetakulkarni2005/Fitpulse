import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.services.prediction_service import get_prediction


router = APIRouter(
    prefix="/prediction",
    tags=["Prediction"]
)


class PredictionRequest(BaseModel):
    sample_index: int = Field(
        default=0,
        ge=0
    )


@router.post("/")
def create_prediction(
    request: PredictionRequest
):
    """
    Predict overload risk for a test sample.
    """

    try:

        return get_prediction(
            sample_index=request.sample_index
        )

    except IndexError as error:

        raise HTTPException(
            status_code=400,
            detail=str(error)
        )

    except FileNotFoundError as error:

        raise HTTPException(
            status_code=404,
            detail=str(error)
        )

    except Exception as error:

        raise HTTPException(
            status_code=500,
            detail=str(error)
        )


@router.get("/health")
def prediction_health():

    return {
        "status": "ok",
        "service": "FitPulse Prediction API"
    }


if __name__ == "__main__":

    print("FitPulse Prediction API")
    print("=" * 55)

    print("API router loaded successfully.")

    print("\nAvailable endpoints:")
    print("POST /prediction/")
    print("GET  /prediction/health")