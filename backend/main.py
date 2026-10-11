import sys
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

PROJECT_ROOT = Path(__file__).resolve().parents[1]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.api.athletes import router as athletes_router
from backend.api.training import router as training_router
from backend.api.prediction import router as prediction_router
from backend.api.explanation import router as explanation_router
from backend.api.simulator import router as simulator_router
from backend.api.recommendations import router as recommendations_router
from backend.api.evidence import router as evidence_router


app = FastAPI(
    title="FitPulse API",
    description="AI-Based Training Adaptation and Early Overload Risk Prediction",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(athletes_router)
app.include_router(training_router)
app.include_router(prediction_router)
app.include_router(explanation_router)
app.include_router(simulator_router)
app.include_router(recommendations_router)
app.include_router(evidence_router)


@app.get("/")
def root():
    return {
        "status": "ok",
        "message": "FitPulse API is running",
    }


if __name__ == "__main__":
    uvicorn.run(
        app,
        host="127.0.0.1",
        port=8000,
        reload=False,
    )