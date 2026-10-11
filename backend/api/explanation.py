import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.explainability.shap_explainer import (
    explain_prediction
)


router = APIRouter(
    prefix="/explanation",
    tags=["Explanation"]
)


class ExplanationRequest(BaseModel):
    sample_index: int = Field(
        default=0,
        ge=0
    )


@router.post("/")
def create_explanation(
    request: ExplanationRequest
):
    """
    Generate feature-attribution explanation
    for one test sample.
    """

    try:

        result = explain_prediction(
            sample_index=request.sample_index
        )

        return result

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
def explanation_health():

    return {
        "status": "ok",
        "service": "FitPulse Explanation API"
    }


if __name__ == "__main__":

    print("FitPulse Explanation API")
    print("=" * 55)

    print("API router loaded successfully.")

    print("\nAvailable endpoints:")
    print("POST /explanation/")
    print("GET  /explanation/health")