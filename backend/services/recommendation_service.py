import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.rag.recommendation import (
    build_recommendation_context,
    generate_recommendation_prompt,
)


def get_recommendation(
    risk_level,
    contributing_features=None,
    symptoms=None,
    top_k=5
):
    contributing_features = contributing_features or []
    symptoms = symptoms or []

    context = build_recommendation_context(
        risk_level=risk_level,
        contributing_features=contributing_features,
        symptoms=symptoms,
        top_k=top_k
    )

    evidence = context.get("retrieved_evidence", [])

    risk = str(risk_level).strip().lower()

    if risk == "high":
        recommendations = [
            {
                "title": "Reduce high-intensity training",
                "description": "Reduce sprint intensity and avoid sudden increases in training load.",
                "evidence": "High overload risk"
            },
            {
                "title": "Increase recovery",
                "description": "Allow additional recovery between demanding training sessions.",
                "evidence": "High overload risk"
            },
            {
                "title": "Monitor pain and soreness",
                "description": "Closely monitor pain, soreness and fatigue. Stop or modify training if symptoms worsen.",
                "evidence": "Athlete monitoring"
            }
        ]

    elif risk == "moderate":
        recommendations = [
            {
                "title": "Control training load",
                "description": "Maintain gradual progression and avoid sudden increases in workload.",
                "evidence": "Moderate overload risk"
            },
            {
                "title": "Prioritize recovery",
                "description": "Provide adequate recovery between demanding sessions.",
                "evidence": "Moderate overload risk"
            },
            {
                "title": "Monitor fatigue and soreness",
                "description": "Track fatigue and soreness and adjust training if they increase.",
                "evidence": "Athlete monitoring"
            }
        ]

    else:
        recommendations = [
            {
                "title": "Maintain gradual progression",
                "description": "Continue progressive training while avoiding sudden workload increases.",
                "evidence": "Low overload risk"
            },
            {
                "title": "Continue recovery monitoring",
                "description": "Continue monitoring fatigue, soreness and recovery during training.",
                "evidence": "Athlete monitoring"
            },
            {
                "title": "Monitor new symptoms",
                "description": "Track any new or worsening pain or soreness during future sessions.",
                "evidence": "Athlete monitoring"
            }
        ]

    # Add retrieved evidence when available
    for item in evidence:
        if not isinstance(item, dict):
            continue

        title = (
            item.get("title")
            or item.get("name")
            or item.get("topic")
            or item.get("injury")
            or "Relevant Evidence"
        )

        evidence_text = (
            item.get("evidence")
            or item.get("text")
            or item.get("description")
            or item.get("content")
            or ""
        )

        recommendations.append({
            "title": f"Evidence: {title}",
            "description": evidence_text,
            "evidence": title
        })

    recommendation_prompt = generate_recommendation_prompt(
        risk_level=risk_level,
        contributing_features=contributing_features,
        symptoms=symptoms,
        top_k=top_k
    )

    return {
        "risk_level": risk_level,
        "contributing_features": contributing_features,
        "symptoms": symptoms,
        "recommendations": recommendations[:top_k],
        "evidence": evidence[:top_k],
        "recommendation_prompt": recommendation_prompt
    }


if __name__ == "__main__":
    print("FitPulse Recommendation Service")
    print("=" * 55)

    result = get_recommendation(
        risk_level="Low",
        contributing_features=["Training_Load", "Fatigue", "Soreness"],
        symptoms=[],
        top_k=5
    )

    print("\nRecommendations:")
    for item in result["recommendations"]:
        print(f"- {item['title']}")
        print(f"  {item['description']}")