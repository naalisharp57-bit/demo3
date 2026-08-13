"""
Step 5 - Baseline models for comparison (scikit-learn).

Baselines use FLATTENED features: static features concatenated with the
flattened weather sequence, so classic tabular models can consume them.
"""
import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def flatten(X_static: np.ndarray, X_seq: np.ndarray) -> np.ndarray:
    """Concatenate static features with the flattened (WEEKS*channels) sequence."""
    return np.hstack([X_static, X_seq.reshape(X_seq.shape[0], -1)])


def evaluate(y_true, y_pred) -> dict:
    """Return MAE, RMSE and R2 as a dict of floats."""
    return {
        "MAE": float(mean_absolute_error(y_true, y_pred)),
        "RMSE": float(np.sqrt(mean_squared_error(y_true, y_pred))),
        "R2": float(r2_score(y_true, y_pred)),
    }


def train_baselines(train: dict, test: dict):
    """Train Linear Regression + Random Forest and evaluate on the test set.

    Args:
        train/test: dicts with keys "X_static", "X_seq", "y".
    Returns:
        (results_dict, fitted_models_dict)
    """
    Xtr, ytr = flatten(train["X_static"], train["X_seq"]), train["y"]
    Xte, yte = flatten(test["X_static"], test["X_seq"]), test["y"]

    results, models = {}, {}

    lr = LinearRegression().fit(Xtr, ytr)
    results["LinearRegression"] = evaluate(yte, lr.predict(Xte))
    models["LinearRegression"] = lr

    rf = RandomForestRegressor(n_estimators=300, random_state=42, n_jobs=-1).fit(Xtr, ytr)
    results["RandomForest"] = evaluate(yte, rf.predict(Xte))
    models["RandomForest"] = rf

    return results, models
