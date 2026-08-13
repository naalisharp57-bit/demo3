"""
Step 6 - Training & evaluation workflow.

Run:  python -m src.train

Does the following:
  1. Loads data/crop_yield.csv
  2. Splits 70/15/15 (train/val/test)
  3. Fits the Preprocessor on TRAIN only
  4. Trains the MLP+LSTM model with EarlyStopping + ModelCheckpoint
  5. Evaluates on TEST (MAE, RMSE, R2) and compares with baselines
  6. Runs a small ablation study (static-only vs seq-only)
  7. Saves the model (.keras) and the fitted Preprocessor (.joblib)
"""
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint

from .config import DATA_PATH, MODEL_PATH, PREPROCESSOR_PATH, MODELS_DIR
from .preprocessing import Preprocessor
from .model import build_model, build_static_only, build_seq_only
from .baselines import train_baselines, evaluate

RUN_ABLATION = True


def load_data() -> pd.DataFrame:
    df = pd.read_csv(DATA_PATH)
    print(f"Loaded {df.shape[0]} rows, {df.shape[1]} columns from {DATA_PATH}")
    return df


def split(df: pd.DataFrame, seed: int = 42):
    """70% train / 15% val / 15% test."""
    train_df, temp_df = train_test_split(df, test_size=0.30, random_state=seed)
    val_df, test_df = train_test_split(temp_df, test_size=0.50, random_state=seed)
    return train_df, val_df, test_df


def make_arrays(pre: Preprocessor, df: pd.DataFrame) -> dict:
    Xs, Xq, y = pre.transform(df)
    return {"X_static": Xs, "X_seq": Xq, "y": y}


def run_ablation(tr: dict, va: dict, te: dict, epochs: int = 60) -> dict:
    """Train single-branch models to show each data type matters."""
    es = EarlyStopping(monitor="val_loss", patience=10, restore_best_weights=True)
    results = {}

    m1 = build_static_only(tr["X_static"].shape[1])
    m1.fit(tr["X_static"], tr["y"], validation_data=(va["X_static"], va["y"]),
           epochs=epochs, batch_size=32, callbacks=[es], verbose=0)
    results["static_only"] = evaluate(te["y"], m1.predict(te["X_static"], verbose=0).ravel())

    m2 = build_seq_only(tr["X_seq"].shape[1], tr["X_seq"].shape[2])
    m2.fit(tr["X_seq"], tr["y"], validation_data=(va["X_seq"], va["y"]),
           epochs=epochs, batch_size=32, callbacks=[es], verbose=0)
    results["seq_only"] = evaluate(te["y"], m2.predict(te["X_seq"], verbose=0).ravel())
    return results


def main() -> None:
    MODELS_DIR.mkdir(parents=True, exist_ok=True)

    df = load_data()
    train_df, val_df, test_df = split(df)

    # Fit preprocessing on TRAIN only, then transform every split.
    pre = Preprocessor().fit(train_df)
    tr, va, te = make_arrays(pre, train_df), make_arrays(pre, val_df), make_arrays(pre, test_df)

    n_static = tr["X_static"].shape[1]
    n_timesteps, n_channels = tr["X_seq"].shape[1], tr["X_seq"].shape[2]
    print(f"Shapes -> static={n_static}, timesteps={n_timesteps}, channels={n_channels}")

    model = build_model(n_static, n_timesteps, n_channels)
    model.summary()

    callbacks = [
        EarlyStopping(monitor="val_loss", patience=15, restore_best_weights=True),
        ModelCheckpoint(str(MODEL_PATH), monitor="val_loss", save_best_only=True),
    ]
    history = model.fit(
        [tr["X_static"], tr["X_seq"]], tr["y"],
        validation_data=([va["X_static"], va["X_seq"]], va["y"]),
        epochs=200, batch_size=32, callbacks=callbacks, verbose=1,
    )

    # --- Evaluation ---
    dl_pred = model.predict([te["X_static"], te["X_seq"]], verbose=0).ravel()
    print("\n=== Deep Learning (MLP + LSTM) ===")
    print(evaluate(te["y"], dl_pred))

    print("\n=== Baselines (test set) ===")
    base_results, _ = train_baselines(tr, te)
    for name, metrics in base_results.items():
        print(f"{name}: {metrics}")

    if RUN_ABLATION:
        print("\n=== Ablation study ===")
        for name, metrics in run_ablation(tr, va, te).items():
            print(f"{name}: {metrics}")

    # --- Persist artifacts (model file already saved by ModelCheckpoint) ---
    pre.save(PREPROCESSOR_PATH)
    print(f"\nSaved model      -> {MODEL_PATH}")
    print(f"Saved preprocessor -> {PREPROCESSOR_PATH}")

    # --- Optional training curve ---
    try:
        import matplotlib.pyplot as plt
        plt.figure()
        plt.plot(history.history["loss"], label="train")
        plt.plot(history.history["val_loss"], label="val")
        plt.xlabel("epoch"); plt.ylabel("MSE loss"); plt.legend()
        plt.title("Training curve")
        plt.savefig(MODELS_DIR / "training_curve.png", dpi=120, bbox_inches="tight")
        print(f"Saved training curve -> {MODELS_DIR / 'training_curve.png'}")
    except Exception as exc:  # plotting is optional
        print("Skipping training curve plot:", exc)


if __name__ == "__main__":
    main()
