"""
FitPulse - GRU Model

Purpose:
1. Use the finalized data preparation pipeline from train.py
2. Build a GRU neural network
3. Train it for Low / Moderate / High overload risk
4. Use 7 previous sessions to predict the NEXT session
5. Evaluate validation and test data
6. Print accuracy, precision, recall and F1-score
7. Show a confusion matrix

Methodology:
- Athlete-wise train/validation/test split
- Training-only feature scaling
- No target leakage
- 7 previous sessions -> next-session prediction
- Same prepared data as LSTM for fair comparison
- Class weights for class imbalance
"""

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


# ============================================================
# REPRODUCIBILITY
# ============================================================

np.random.seed(SEED)
tf.random.set_seed(SEED)


# ============================================================
# METRICS
# ============================================================

def calculate_metrics(y_true, y_pred):

    classes = [0, 1, 2]

    class_names = {
        0: "Low",
        1: "Moderate",
        2: "High",
    }

    accuracy = np.mean(y_true == y_pred) * 100

    print("\nAccuracy:")
    print(f"  {accuracy:.2f}%")

    print("\nClass-wise metrics:")

    all_precisions = []
    all_recalls = []
    all_f1 = []

    for class_id in classes:

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
                2
                * precision
                * recall
                / (precision + recall)
            )
        else:
            f1 = 0.0

        all_precisions.append(precision)
        all_recalls.append(recall)
        all_f1.append(f1)

        print(f"\n  {class_names[class_id]}")

        print(
            f"    Precision: {precision:.4f}"
        )

        print(
            f"    Recall:    {recall:.4f}"
        )

        print(
            f"    F1-score:  {f1:.4f}"
        )

    macro_precision = np.mean(all_precisions)
    macro_recall = np.mean(all_recalls)
    macro_f1 = np.mean(all_f1)

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
        matrix[actual, predicted] += 1

    print("\n" + "=" * 70)
    print("CONFUSION MATRIX")
    print("=" * 70)

    print("\nRows = Actual")
    print("Columns = Predicted")

    print(
        "\n             "
        "Low   Moderate   High"
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
# BUILD GRU MODEL
# ============================================================

def build_gru_model(number_of_features):

    model = tf.keras.Sequential(
        [

            # Input
            tf.keras.layers.Input(
                shape=(
                    SEQUENCE_LENGTH,
                    number_of_features,
                )
            ),

            # First GRU layer
            tf.keras.layers.GRU(
                64,
                return_sequences=True,
            ),

            tf.keras.layers.Dropout(
                0.30
            ),

            # Second GRU layer
            tf.keras.layers.GRU(
                32,
                return_sequences=False,
            ),

            tf.keras.layers.Dropout(
                0.30
            ),

            # Dense layer
            tf.keras.layers.Dense(
                32,
                activation="relu",
            ),

            tf.keras.layers.Dropout(
                0.20
            ),

            # Output layer
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

        loss=(
            "sparse_categorical_crossentropy"
        ),

        metrics=[
            "accuracy"
        ],
    )

    return model


# ============================================================
# MAIN
# ============================================================

def main():

    print("=" * 70)
    print("FITPULSE GRU MODEL TRAINING")
    print("=" * 70)

    # --------------------------------------------------------
    # PREPARE MODEL DATA
    # --------------------------------------------------------

    print(
        "\nUsing finalized train.py pipeline..."
    )

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
    # VERIFY SEQUENCE LENGTH
    # --------------------------------------------------------

    if X_train.shape[1] != SEQUENCE_LENGTH:

        raise ValueError(
            "Sequence length mismatch. "
            f"Expected {SEQUENCE_LENGTH}, "
            f"but received {X_train.shape[1]}."
        )

    # --------------------------------------------------------
    # INPUT DATA
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("GRU INPUT DATA")
    print("=" * 70)

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
        f"\nSequence length: "
        f"{X_train.shape[1]} sessions"
    )

    print(
        f"Features per session: "
        f"{X_train.shape[2]}"
    )

    print("\nPrediction setup:")

    print(
        "7 previous sessions -> "
        "NEXT session risk"
    )

    # --------------------------------------------------------
    # BUILD MODEL
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("BUILDING GRU MODEL")
    print("=" * 70)

    model = build_gru_model(
        number_of_features
    )

    print()

    model.summary()

    # --------------------------------------------------------
    # CALLBACKS
    # --------------------------------------------------------

    early_stopping = (
        tf.keras.callbacks.EarlyStopping(
            monitor="val_loss",
            patience=5,
            restore_best_weights=True,
            verbose=1,
        )
    )

    reduce_learning_rate = (
        tf.keras.callbacks.ReduceLROnPlateau(
            monitor="val_loss",
            factor=0.5,
            patience=2,
            min_lr=0.00001,
            verbose=1,
        )
    )

    # --------------------------------------------------------
    # TRAIN
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("STARTING GRU TRAINING")
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
    # VALIDATION EVALUATION
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("VALIDATION EVALUATION")
    print("=" * 70)

    validation_probabilities = (
        model.predict(
            X_validation,
            verbose=0,
        )
    )

    validation_predictions = (
        np.argmax(
            validation_probabilities,
            axis=1,
        )
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
    # FINAL TEST EVALUATION
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("FINAL TEST EVALUATION")
    print("=" * 70)

    test_probabilities = (
        model.predict(
            X_test,
            verbose=0,
        )
    )

    test_predictions = (
        np.argmax(
            test_probabilities,
            axis=1,
        )
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
    # TRAINING SUMMARY
    # --------------------------------------------------------

    print("\n" + "=" * 70)
    print("TRAINING SUMMARY")
    print("=" * 70)

    epochs_completed = len(
        history.history["loss"]
    )

    best_validation_loss = min(
        history.history["val_loss"]
    )

    best_validation_accuracy = max(
        history.history["val_accuracy"]
    )

    print(
        f"\nEpochs requested: "
        f"{EPOCHS}"
    )

    print(
        f"Epochs actually completed: "
        f"{epochs_completed}"
    )

    print(
        f"\nBest validation loss: "
        f"{best_validation_loss:.4f}"
    )

    print(
        f"Best validation accuracy: "
        f"{best_validation_accuracy * 100:.2f}%"
    )

    print("\n" + "=" * 70)
    print("GRU TRAINING COMPLETED")
    print("=" * 70)

    print("\n✓ Data preparation completed")
    print("✓ Athlete-wise split completed")
    print("✓ Training-only scaling completed")
    print("✓ 7 previous sessions used")
    print("✓ Next-session prediction used")
    print("✓ GRU training completed")
    print("✓ Validation evaluation completed")
    print("✓ Test evaluation completed")

    print(
        "\nNext step: LSTM vs GRU comparison."
    )


# ============================================================
# RUN
# ============================================================

if __name__ == "__main__":
    main()