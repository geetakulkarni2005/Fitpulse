"""
FitPulse - LSTM Model

Purpose:
1. Prepare the finalized FitPulse data using train.py
2. Build an LSTM model
3. Train it for Low / Moderate / High overload risk
4. Evaluate validation and test data
5. Print accuracy, precision, recall and F1-score
6. Show confusion matrix
7. Save the trained LSTM model
"""

from pathlib import Path

import numpy as np
import tensorflow as tf

from train import prepare_model_data


# ============================================================
# SETTINGS
# ============================================================

SEED = 42

EPOCHS = 30
BATCH_SIZE = 64

SEQUENCE_LENGTH = 7
NUMBER_OF_CLASSES = 3

MODEL_PATH = (
    Path(__file__).resolve().parent
    / "lstm_model.keras"
)

np.random.seed(SEED)
tf.random.set_seed(SEED)


# ============================================================
# METRICS
# ============================================================

def calculate_metrics(y_true, y_pred):

    class_names = {
        0: "Low",
        1: "Moderate",
        2: "High",
    }

    accuracy = (
        np.mean(y_true == y_pred) * 100
    )

    print("\nAccuracy:")
    print(f"  {accuracy:.2f}%")

    print("\nClass-wise metrics:")

    precisions = []
    recalls = []
    f1_scores = []

    for class_id in range(NUMBER_OF_CLASSES):

        true_positive = np.sum(
            (y_true == class_id)
            & (y_pred == class_id)
        )

        false_positive = np.sum(
            (y_true != class_id)
            & (y_pred == class_id)
        )

        false_negative = np.sum(
            (y_true == class_id)
            & (y_pred != class_id)
        )

        if true_positive + false_positive > 0:
            precision = (
                true_positive
                / (true_positive + false_positive)
            )
        else:
            precision = 0.0

        if true_positive + false_negative > 0:
            recall = (
                true_positive
                / (true_positive + false_negative)
            )
        else:
            recall = 0.0

        if precision + recall > 0:
            f1 = (
                2 * precision * recall
                / (precision + recall)
            )
        else:
            f1 = 0.0

        precisions.append(precision)
        recalls.append(recall)
        f1_scores.append(f1)

        print(
            f"\n  {class_names[class_id]}"
        )

        print(
            f"    Precision: {precision:.4f}"
        )

        print(
            f"    Recall:    {recall:.4f}"
        )

        print(
            f"    F1-score:  {f1:.4f}"
        )

    macro_precision = np.mean(precisions)
    macro_recall = np.mean(recalls)
    macro_f1 = np.mean(f1_scores)

    print("\nMacro-average:")

    print(
        f"  Precision: {macro_precision:.4f}"
    )

    print(
        f"  Recall:    {macro_recall:.4f}"
    )

    print(
        f"  F1-score:  {macro_f1:.4f}"
    )


# ============================================================
# CONFUSION MATRIX
# ============================================================

def print_confusion_matrix(y_true, y_pred):

    matrix = np.zeros(
        (
            NUMBER_OF_CLASSES,
            NUMBER_OF_CLASSES,
        ),
        dtype=int,
    )

    for actual, predicted in zip(
        y_true,
        y_pred,
    ):
        matrix[
            actual,
            predicted
        ] += 1

    print("\n" + "=" * 70)
    print("CONFUSION MATRIX")
    print("=" * 70)

    print("\nRows = Actual")
    print("Columns = Predicted")

    print(
        "\n             Low   Moderate   High"
    )

    names = [
        "Low",
        "Moderate",
        "High",
    ]

    for i, name in enumerate(names):

        print(
            f"{name:<10}"
            f"{matrix[i, 0]:>6}"
            f"{matrix[i, 1]:>11}"
            f"{matrix[i, 2]:>7}"
        )


# ============================================================
# BUILD LSTM MODEL
# ============================================================

def build_lstm_model(number_of_features):

    model = tf.keras.Sequential(
        [

            tf.keras.layers.Input(
                shape=(
                    SEQUENCE_LENGTH,
                    number_of_features,
                )
            ),

            tf.keras.layers.LSTM(
                64,
                return_sequences=True,
            ),

            tf.keras.layers.Dropout(
                0.30
            ),

            tf.keras.layers.LSTM(
                32,
                return_sequences=False,
            ),

            tf.keras.layers.Dropout(
                0.30
            ),

            tf.keras.layers.Dense(
                32,
                activation="relu",
            ),

            tf.keras.layers.Dropout(
                0.20
            ),

            tf.keras.layers.Dense(
                NUMBER_OF_CLASSES,
                activation="softmax",
            ),
        ]
    )

    model.compile(
        optimizer=tf.keras.optimizers.Adam(
            learning_rate=0.001
        ),
        loss="sparse_categorical_crossentropy",
        metrics=["accuracy"],
    )

    return model


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("FITPULSE LSTM MODEL TRAINING")
    print("=" * 70)

    # --------------------------------------------------------
    # Prepare finalized model data
    # --------------------------------------------------------

    (
        X_train,
        y_train,
        X_validation,
        y_validation,
        X_test,
        y_test,
        class_weights,
        number_of_features,
    ) = prepare_model_data()

    # --------------------------------------------------------
    # Verify sequence length
    # --------------------------------------------------------

    if X_train.shape[1] != SEQUENCE_LENGTH:

        raise ValueError(
            f"Expected sequence length "
            f"{SEQUENCE_LENGTH}, "
            f"but received "
            f"{X_train.shape[1]}."
        )

    print(
        f"\nTraining shape: "
        f"{X_train.shape}"
    )

    print(
        f"Validation shape: "
        f"{X_validation.shape}"
    )

    print(
        f"Test shape: "
        f"{X_test.shape}"
    )

    print(
        f"\nNumber of features: "
        f"{number_of_features}"
    )

    # --------------------------------------------------------
    # Build model
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("BUILDING LSTM MODEL")
    print("=" * 70)

    model = build_lstm_model(
        number_of_features
    )

    model.summary()

    # --------------------------------------------------------
    # Callbacks
    # --------------------------------------------------------

    early_stopping = (
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
        )
    )

    reduce_learning_rate = (
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=2,
            min_lr=0.00001,
        )
    )

    # --------------------------------------------------------
    # Train
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("STARTING LSTM TRAINING")
    print("=" * 70)

    history = model.fit(
        X_train,
        y_train,

        validation_data=(
            X_validation,
            y_validation,
        ),

        epochs=EPOCHS,

        batch_size=BATCH_SIZE,

        class_weight=class_weights,

        callbacks=[
            early_stopping,
            reduce_learning_rate,
        ],

        verbose=1,
    )

    # --------------------------------------------------------
    # Validation evaluation
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("VALIDATION EVALUATION")
    print("=" * 70)

    validation_probabilities = model.predict(
        X_validation,
        verbose=0,
    )

    validation_predictions = np.argmax(
        validation_probabilities,
        axis=1,
    )

    calculate_metrics(
        y_validation,
        validation_predictions,
    )

    print_confusion_matrix(
        y_validation,
        validation_predictions,
    )

    # --------------------------------------------------------
    # Final test evaluation
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("FINAL TEST EVALUATION")
    print("=" * 70)

    test_probabilities = model.predict(
        X_test,
        verbose=0,
    )

    test_predictions = np.argmax(
        test_probabilities,
        axis=1,
    )

    calculate_metrics(
        y_test,
        test_predictions,
    )

    print_confusion_matrix(
        y_test,
        test_predictions,
    )

    # --------------------------------------------------------
    # Save best trained model
    # --------------------------------------------------------

    model.save(MODEL_PATH)

    print("\n" + "=" * 70)
    print("MODEL SAVED")
    print("=" * 70)

    print(
        f"\nLSTM model saved to:"
    )

    print(
        f"{MODEL_PATH}"
    )

    # --------------------------------------------------------
    # Training summary
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("TRAINING SUMMARY")
    print("=" * 70)

    print(
        f"\nEpochs requested: "
        f"{EPOCHS}"
    )

    print(
        f"Epochs completed: "
        f"{len(history.history['loss'])}"
    )

    print(
        f"\nBest validation loss: "
        f"{min(history.history['val_loss']):.4f}"
    )

    print(
        f"Best validation accuracy: "
        f"{max(history.history['val_accuracy']) * 100:.2f}%"
    )

    print(
        "\n✓ LSTM training completed."
    )

    print(
        "✓ LSTM model saved successfully."
    )


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()