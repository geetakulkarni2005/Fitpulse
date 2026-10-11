"""
FitPulse Knowledge Base

Evidence used by the RAG layer for athlete-risk recommendations.
"""

KNOWLEDGE_BASE = [
    {
        "id": "100m_hamstring",
        "event": "100m",
        "topic": "Hamstring Pull",
        "keywords": [
            "hamstring",
            "sprint",
            "acceleration",
            "top speed",
            "tightness",
            "pain",
        ],
        "content": (
            "Hamstring Pull (Grade 1 Strain): "
            "A sudden, minor twinge or deep cramp-like tightness "
            "in the back of the thigh, usually felt during the "
            "transition from acceleration to top speed."
        ),
    },
    {
        "id": "100m_adductor",
        "event": "100m",
        "topic": "Adductor Groin Strain",
        "keywords": [
            "adductor",
            "groin",
            "inner thigh",
            "push-off",
            "sprint",
            "pain",
        ],
        "content": (
            "Adductor (Groin) Strain: "
            "Localized ache or pulling sensation in the inner thigh, "
            "heavily aggravated during the explosive push-off "
            "from the starting blocks."
        ),
    },
    {
        "id": "100m_hip_flexor",
        "event": "100m",
        "topic": "Hip Flexor Tightness",
        "keywords": [
            "hip",
            "hip flexor",
            "tightness",
            "knee",
            "sprinting",
            "pain",
        ],
        "content": (
            "Hip Flexor Tightness: "
            "Pinching discomfort at the front of the hip joint "
            "when driving the knee upward into the sprinting position."
        ),
    },
    {
        "id": "100m_achilles",
        "event": "100m",
        "topic": "Achilles Tendinopathy",
        "keywords": [
            "achilles",
            "heel",
            "stiffness",
            "burning",
            "toes",
            "running",
        ],
        "content": (
            "Achilles Tendinopathy: "
            "Stiffness and a burning sensation at the back of the heel, "
            "especially during the first few steps out of bed or when "
            "rising onto the toes."
        ),
    },
    {
        "id": "100m_shin_splints",
        "event": "100m",
        "topic": "Shin Splints",
        "keywords": [
            "shin",
            "shin splints",
            "tibia",
            "impact",
            "hard track",
            "pain",
        ],
        "content": (
            "Shin Splints (Medial Tibial Stress Syndrome): "
            "A broad, throbbing ache along the inner side of the shin bone, "
            "typically caused by high impact on hard tracks."
        ),
    },
    {
        "id": "100m_calf",
        "event": "100m",
        "topic": "Calf Tightness or Strain",
        "keywords": [
            "calf",
            "lower leg",
            "tightness",
            "strain",
            "toe-off",
            "pain",
        ],
        "content": (
            "Calf Tightness or Strain: "
            "Sudden, knot-like restriction or mild throbbing in the lower "
            "leg muscle during the rapid toe-off phase."
        ),
    },
    {
        "id": "100m_plantar",
        "event": "100m",
        "topic": "Plantar Fasciitis",
        "keywords": [
            "plantar",
            "heel",
            "arch",
            "foot",
            "warm-up",
            "pain",
        ],
        "content": (
            "Plantar Fasciitis: "
            "Sharp, stabbing pain under the heel or arch during the "
            "warm-up that temporarily fades as the foot gets warm."
        ),
    },
]


def get_all_evidence():
    """
    Return the complete knowledge base.
    """
    return KNOWLEDGE_BASE.copy()


def get_evidence_by_event(event):
    """
    Return evidence associated with an event.
    """

    event = str(event).strip().lower()

    return [
        item
        for item in KNOWLEDGE_BASE
        if item["event"].lower() == event
    ]


def get_evidence_by_topic(topic):
    """
    Return evidence matching a topic.
    """

    topic = str(topic).strip().lower()

    return [
        item
        for item in KNOWLEDGE_BASE
        if topic in item["topic"].lower()
    ]


def get_evidence_by_keyword(keyword):
    """
    Return evidence containing a keyword.
    """

    keyword = str(keyword).strip().lower()

    results = []

    for item in KNOWLEDGE_BASE:

        if (
            keyword in item["topic"].lower()
            or keyword in item["content"].lower()
            or any(
                keyword in k.lower()
                for k in item["keywords"]
            )
        ):
            results.append(item)

    return results


if __name__ == "__main__":

    print("FitPulse Knowledge Base")
    print("=" * 50)
    print(f"Total evidence entries: {len(KNOWLEDGE_BASE)}")

    for item in KNOWLEDGE_BASE:
        print(
            f"{item['id']} | "
            f"{item['event']} | "
            f"{item['topic']}"
        )