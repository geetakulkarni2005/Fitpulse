import sys
from pathlib import Path
import re

PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.rag.knowledge_base import get_all_evidence


def _tokenize(text):
    if not text:
        return set()

    return set(
        re.findall(
            r"[a-zA-Z0-9_]+",
            str(text).lower()
        )
    )


def _get_value(item, *keys):
    for key in keys:
        if key in item and item[key] is not None:
            return item[key]

    return ""


def retrieve_evidence(query, top_k=5):
    """
    Retrieve evidence from the FitPulse knowledge base
    using simple keyword-overlap scoring.
    """

    query_tokens = _tokenize(query)

    if not query_tokens:
        return []

    evidence_items = get_all_evidence()
    scored_results = []

    for item in evidence_items:

        title = _get_value(
            item,
            "title",
            "name",
            "topic",
            "injury"
        )

        event = _get_value(
            item,
            "event"
        )

        evidence_text = _get_value(
            item,
            "evidence",
            "text",
            "description",
            "content"
        )

        searchable_text = " ".join(
            [
                str(title),
                str(event),
                str(evidence_text)
            ]
        )

        evidence_tokens = _tokenize(searchable_text)

        score = len(query_tokens.intersection(evidence_tokens))

        if score > 0:
            result = dict(item)
            result["relevance_score"] = score
            scored_results.append(result)

    scored_results.sort(
        key=lambda x: x.get("relevance_score", 0),
        reverse=True
    )

    return scored_results[:top_k]


def retrieve_by_risk_factors(risk_factors, top_k=5):
    """
    Retrieve evidence based on a list of risk factors.
    """

    if not risk_factors:
        return []

    if isinstance(risk_factors, str):
        risk_factors = [risk_factors]

    query = " ".join(
        str(factor)
        for factor in risk_factors
    )

    return retrieve_evidence(
        query=query,
        top_k=top_k
    )


def retrieve_for_athlete(
    risk_level,
    contributing_features=None,
    symptoms=None,
    top_k=5
):
    """
    Retrieve evidence relevant to an athlete's
    predicted risk, contributing features, and symptoms.
    """

    query_parts = []

    if risk_level:
        query_parts.append(str(risk_level))

    if contributing_features:
        query_parts.extend(
            str(feature)
            for feature in contributing_features
        )

    if symptoms:
        query_parts.extend(
            str(symptom)
            for symptom in symptoms
        )

    query = " ".join(query_parts)

    return retrieve_evidence(
        query=query,
        top_k=top_k
    )


def format_evidence(results):
    """
    Convert retrieved evidence into readable text.
    """

    if not results:
        return "No relevant evidence found."

    formatted = []

    for index, item in enumerate(results, start=1):

        title = _get_value(
            item,
            "title",
            "name",
            "topic",
            "injury"
        )

        event = _get_value(
            item,
            "event"
        )

        evidence_text = _get_value(
            item,
            "evidence",
            "text",
            "description",
            "content"
        )

        score = item.get(
            "relevance_score",
            0
        )

        formatted.append(
            f"{index}. {title}\n"
            f"Event: {event}\n"
            f"Evidence: {evidence_text}\n"
            f"Relevance Score: {score}"
        )

    return "\n\n".join(formatted)


if __name__ == "__main__":

    print("FitPulse RAG Retriever")
    print("=" * 55)

    query = "hamstring sprint acceleration"

    print(f"\nQuery: {query}")

    results = retrieve_evidence(
        query=query,
        top_k=5
    )

    print("\nRetrieved Evidence:")
    print("-" * 55)

    print(format_evidence(results))