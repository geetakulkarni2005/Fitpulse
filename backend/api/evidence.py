import sys
from pathlib import Path

from fastapi import APIRouter, HTTPException
from typing import Optional

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.rag.knowledge_base import (
    get_all_evidence,
    get_evidence_by_event,
    get_evidence_by_topic,
    get_evidence_by_keyword,
)


router = APIRouter(
    prefix="/evidence",
    tags=["Evidence"]
)


@router.get("/")
def get_all_evidence_api():
    """
    Return all evidence available in the FitPulse knowledge base.
    """
    return {
        "count": len(get_all_evidence()),
        "evidence": get_all_evidence()
    }


@router.get("/event/{event}")
def get_event_evidence(event: str):
    """
    Return evidence for a specific athletic event.
    """
    results = get_evidence_by_event(event)

    return {
        "event": event,
        "count": len(results),
        "evidence": results
    }


@router.get("/topic/{topic}")
def get_topic_evidence(topic: str):
    """
    Return evidence matching a specific topic.
    """
    results = get_evidence_by_topic(topic)

    return {
        "topic": topic,
        "count": len(results),
        "evidence": results
    }


@router.get("/search")
def search_evidence(keyword: Optional[str] = None):
    """
    Search the FitPulse knowledge base using a keyword.
    """

    if not keyword:
        raise HTTPException(
            status_code=400,
            detail="Keyword is required."
        )

    results = get_evidence_by_keyword(keyword)

    return {
        "keyword": keyword,
        "count": len(results),
        "evidence": results
    }


@router.get("/health")
def evidence_health():
    return {
        "status": "ok",
        "service": "FitPulse Evidence API",
        "evidence_count": len(get_all_evidence())
    }


if __name__ == "__main__":
    print("FitPulse Evidence API")
    print("=" * 55)

    evidence = get_all_evidence()

    print(f"Knowledge base entries: {len(evidence)}")
    print("API router loaded successfully.")

    print("\nAvailable endpoints:")
    print("GET /evidence/")
    print("GET /evidence/event/{event}")
    print("GET /evidence/topic/{topic}")
    print("GET /evidence/search?keyword=...")
    print("GET /evidence/health")