import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.simulator.what_if import simulate_training_change


router = APIRouter(
    prefix="/simulator",
    tags=["What-If Simulator"]
)


class SimulationRequest(BaseModel):
    sample_index: int = Field(
        default=0,
        ge=0
    )

    training_load_change_percent: float = Field(
        default=0.0,
        ge=-100.0,
        le=200.0
    )


@router.post("/")
def run_simulation(
    request: SimulationRequest
):
    """
    Simulate a training-load change and
    compare the original and simulated risk.
    """

    try:

        result = simulate_training_change(
            sample_index=request.sample_index,
            training_load_change_percent=(
                request.training_load_change_percent
            )
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
def simulator_health():

    return {
        "status": "ok",
        "service": "FitPulse What-If Simulator API"
    }


if __name__ == "__main__":

    print("FitPulse What-If Simulator API")
    print("=" * 55)

    print("API router loaded successfully.")

    print("\nAvailable endpoints:")
    print("POST /simulator/")
    print("GET  /simulator/health")