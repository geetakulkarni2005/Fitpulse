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


def _predict_sample(model, sample):
    """
    Predict risk probabilities for one sequence.
    """

    probabilities = model.predict(
        sample,
        verbose=0
    )[0]

    predicted_class = int(
        np.argmax(probabilities)
    )

    return {
        "predicted_class": predicted_class,
        "predicted_risk": RISK_LABELS[
            predicted_class
        ],
        "probabilities": {
            "Low": float(probabilities[0]),
            "Moderate": float(probabilities[1]),
            "High": float(probabilities[2])
        }
    }


def simulate_training_change(
    sample_index=0,
    training_load_change_percent=0.0
):
    """
    Simulate a change in the most recent training-load
    feature of a test sequence.

    Positive value = increase.
    Negative value = decrease.
    """

    model = load_trained_model()

    prediction_data = prepare_prediction_data()

    X_test = prediction_data["X_test"]

    if sample_index < 0 or sample_index >= len(X_test):
        raise IndexError(
            f"sample_index must be between 0 and {len(X_test) - 1}."
        )

    if not isinstance(
        training_load_change_percent,
        (int, float)
    ):
        raise TypeError(
            "training_load_change_percent must be numeric."
        )

    original_sample = X_test[
        sample_index:sample_index + 1
    ].copy()

    simulated_sample = original_sample.copy()

    # Training_Load is the first model feature
    # in the prepared dataset.
    training_load_feature_index = 0

    current_value = simulated_sample[
        0,
        -1,
        training_load_feature_index
    ]

    change_factor = (
        1.0
        + float(training_load_change_percent) / 100.0
    )

    simulated_value = (
        current_value * change_factor
    )

    simulated_sample[
        0,
        -1,
        training_load_feature_index
    ] = simulated_value

    original_prediction = _predict_sample(
        model,
        original_sample
    )

    simulated_prediction = _predict_sample(
        model,
        simulated_sample
    )

    return {
        "sample_index": sample_index,
        "training_load_change_percent": float(
            training_load_change_percent
        ),
        "original_prediction": original_prediction,
        "simulated_prediction": simulated_prediction,
        "risk_changed": (
            original_prediction["predicted_class"]
            != simulated_prediction["predicted_class"]
        )
    }


if __name__ == "__main__":

    print("FitPulse What-If Simulator")
    print("=" * 55)

    try:

        result = simulate_training_change(
            sample_index=0,
            training_load_change_percent=-10
        )

        print("\nWhat-If Simulation")
        print("-" * 55)

        print(
            "Training load change:",
            f"{result['training_load_change_percent']:.1f}%"
        )

        print(
            "\nOriginal risk:",
            result["original_prediction"]["predicted_risk"]
        )

        print(
            "Simulated risk:",
            result["simulated_prediction"]["predicted_risk"]
        )

        print(
            "\nOriginal probabilities:",
            result["original_prediction"]["probabilities"]
        )

        print(
            "Simulated probabilities:",
            result["simulated_prediction"]["probabilities"]
        )

        print(
            "\nRisk changed:",
            result["risk_changed"]
        )

    except Exception as error:

        print("\nWhat-If simulation failed.")
        print("Error:", error)