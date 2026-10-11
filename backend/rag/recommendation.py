import sys
from pathlib import Path

# Allow direct execution from the project root
PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.rag.retriever import retrieve_for_athlete


def build_recommendation_context(
    risk_level,
    contributing_features=None,
    symptoms=None,
    top_k=5
):
    contributing_features = contributing_features or []
    symptoms = symptoms or []

    retrieved_evidence = retrieve_for_athlete(
        risk_level=risk_level,
        contributing_features=contributing_features,
        symptoms=symptoms,
        top_k=top_k
    )

    return {
        "risk_level": risk_level,
        "contributing_features": contributing_features,
        "symptoms": symptoms,
        "retrieved_evidence": retrieved_evidence
    }


def _get_value(item, keys, default=""):
    for key in keys:
        if isinstance(item, dict) and key in item:
            return item[key]
    return default


def format_recommendation_context(context):
    lines = [
        "FITPULSE CONTEXT",
        "================",
        "",
        f"Predicted Risk Level: {context['risk_level']}",
        "",
        "Contributing Features:"
    ]

    if context["contributing_features"]:
        for feature in context["contributing_features"]:
            lines.append(f"- {feature}")
    else:
        lines.append("- None provided")

    lines.extend([
        "",
        "Reported Symptoms:"
    ])

    if context["symptoms"]:
        for symptom in context["symptoms"]:
            lines.append(f"- {symptom}")
    else:
        lines.append("- None reported")

    lines.extend([
        "",
        "Retrieved Evidence:",
        ""
    ])

    evidence = context["retrieved_evidence"]

    if not evidence:
        lines.append("No relevant evidence found.")
        return "\n".join(lines)

    for index, item in enumerate(evidence, start=1):
        title = _get_value(
            item,
            ["title", "name", "topic", "injury"],
            "Relevant Evidence"
        )

        event = _get_value(
            item,
            ["event", "Event"],
            "100m"
        )

        evidence_text = _get_value(
            item,
            ["evidence", "text", "description", "content"],
            ""
        )

        if not evidence_text:
            evidence_text = str(item)

        lines.append(f"{index}. {title}")
        lines.append(f"Event: {event}")
        lines.append(f"Evidence: {evidence_text}")
        lines.append("")

    return "\n".join(lines)


def generate_recommendation_prompt(
    risk_level,
    contributing_features=None,
    symptoms=None,
    top_k=5
):
    context = build_recommendation_context(
        risk_level=risk_level,
        contributing_features=contributing_features,
        symptoms=symptoms,
        top_k=top_k
    )

    formatted_context = format_recommendation_context(context)

    return f"""
You are the recommendation module of FitPulse.

Use only the athlete information and retrieved
evidence provided below.

Do not diagnose an injury.

Provide practical training-management guidance
appropriate for an athlete and coach.

Clearly separate:
- Risk information
- Relevant evidence
- Suggested training adjustments
- When professional assessment should be considered

{formatted_context}
""".strip()


if __name__ == "__main__":
    print("FitPulse RAG Recommendation Module")
    print("=" * 55)

    prompt = generate_recommendation_prompt(
        risk_level="High",
        contributing_features=[
            "Training_Load",
            "Fatigue",
            "Soreness"
        ],
        symptoms=[
            "hamstring tightness"
        ],
        top_k=5
    )

    print("\nGenerated Recommendation Context:")
    print("-" * 55)
    print(prompt)