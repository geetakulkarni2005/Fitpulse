import sys
from pathlib import Path

import numpy as np


PROJECT_ROOT = Path(__file__).resolve().parents[2]

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))


from backend.models.predict import (
    load_trained_model,
    prepare_prediction_data,
)


RISK_LABELS = {
    0: "Low",
    1: "Moderate",
    2: "High"
}


def explain_prediction(sample_index=0):

    model = load_trained_model()
    prediction_data = prepare_prediction_data()

    X_test = prediction_data["X_test"]
    y_test = prediction_data["y_test"]

    if sample_index < 0 or sample_index >= len(X_test):
        raise IndexError(
            f"sample_index must be between 0 and {len(X_test) - 1}."
        )

    sample = X_test[sample_index:sample_index + 1]

    probabilities = model.predict(
        sample,
        verbose=0
    )[0]

    predicted_class = int(
        np.argmax(probabilities)
    )

    actual_class = int(
        y_test[sample_index]
    )

    # Use the actual number of model input features.
    feature_count = X_test.shape[-1]

    # Generate guaranteed matching feature names.
    feature_names = [
        f"Feature_{i + 1}"
        for i in range(feature_count)
    ]

    baseline = np.mean(
        X_test,
        axis=0,
        keepdims=True
    )

    original_probability = float(
        probabilities[predicted_class]
    )

    contributions = []

    for feature_index in range(feature_count):

        perturbed = sample.copy()

        perturbed[
            0,
            :,
            feature_index
        ] = baseline[
            0,
            :,
            feature_index
        ]

        perturbed_probabilities = model.predict(
            perturbed,
            verbose=0
        )[0]

        perturbed_probability = float(
            perturbed_probabilities[predicted_class]
        )

        contribution = (
            original_probability
            - perturbed_probability
        )

        direction = (
            "increased risk"
            if contribution >= 0
            else "decreased risk"
        )

        contributions.append({
            "feature": feature_names[feature_index],
            "contribution": float(contribution),
            "direction": direction
        })

    contributions.sort(
        key=lambda item: abs(item["contribution"]),
        reverse=True
    )

    return {
        "sample_index": sample_index,
        "actual_class": actual_class,
        "actual_risk": RISK_LABELS[actual_class],
        "predicted_class": predicted_class,
        "predicted_risk": RISK_LABELS[predicted_class],
        "probabilities": {
            "Low": float(probabilities[0]),
            "Moderate": float(probabilities[1]),
            "High": float(probabilities[2])
        },
        "top_contributing_features": contributions[:10]
    }


def print_explanation(result):

    print("\nFITPULSE MODEL EXPLAINABILITY")
    print("=" * 60)

    print(
        f"Sample index       : {result['sample_index']}"
    )

    print(
        f"Actual risk        : {result['actual_risk']}"
    )

    print(
        f"Predicted risk     : {result['predicted_risk']}"
    )

    print("\nPrediction probabilities:")

    for risk, probability in result["probabilities"].items():
        print(
            f"{risk:<10}: {probability:.4f}"
        )

    print("\nTop contributing features:")

    for index, item in enumerate(
        result["top_contributing_features"],
        start=1
    ):
        print(
            f"{index}. "
            f"{item['feature']} "
            f"{item['contribution']:+.6f} "
            f"({item['direction']})"
        )


if __name__ == "__main__":

    try:

        result = explain_prediction(
            sample_index=0
        )

        print_explanation(result)

    except Exception as error:

        print("\nExplainability failed.")
        print("Error:", error)