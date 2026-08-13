"""
Step 3 - Reusable preprocessing pipeline (fit/transform pattern).

Produces the TWO inputs the model expects:
  - X_static : (n_samples, n_static)   -> MLP branch
  - X_seq    : (n_samples, WEEKS, 3)   -> LSTM branch (rainfall, temp, humidity)

Fit on the TRAIN split only, then transform train/val/test AND single rows at
inference time. Persist with save()/load() so Flask applies the identical
transformations that were learned during training.
"""
import numpy as np
import pandas as pd
import joblib
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder

from .config import (
    WEEKS, RAINFALL_COLS, TEMP_COLS, HUMIDITY_COLS, ALL_WEATHER_COLS,
    NUMERIC_STATIC, CATEGORICAL_STATIC, TARGET,
)


class Preprocessor:
    def __init__(self, weeks: int = WEEKS):
        self.weeks = weeks
        self.weather_imputer = SimpleImputer(strategy="mean")
        self.num_imputer = SimpleImputer(strategy="median")
        self.cat_imputer = SimpleImputer(strategy="most_frequent")
        self.num_scaler = StandardScaler()
        try:  # scikit-learn >= 1.2
            self.encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
        except TypeError:  # older scikit-learn
            self.encoder = OneHotEncoder(handle_unknown="ignore", sparse=False)
        self.seq_scalers: list[StandardScaler] = []
        self.static_feature_names: list[str] = []
        self.fitted = False

    # ------------------------------------------------------------------ helpers
    @staticmethod
    def _add_derived(df: pd.DataFrame) -> pd.DataFrame:
        """Derive numeric 'sowing_doy' (day-of-year) from the sowing_date string."""
        df = df.copy()
        doy = pd.to_datetime(df["sowing_date"], errors="coerce").dt.dayofyear
        fill = doy.median() if doy.notna().any() else 150
        df["sowing_doy"] = doy.fillna(fill)
        return df

    def _build_sequence(self, wdf: pd.DataFrame) -> np.ndarray:
        """Reshape weekly weather columns into (n, WEEKS, 3) for the LSTM."""
        rain = wdf[RAINFALL_COLS].to_numpy(dtype=float)
        temp = wdf[TEMP_COLS].to_numpy(dtype=float)
        hum = wdf[HUMIDITY_COLS].to_numpy(dtype=float)
        return np.stack([rain, temp, hum], axis=-1)  # (n, WEEKS, 3)

    def _fit_seq_scalers(self, seq: np.ndarray) -> None:
        self.seq_scalers = []
        for c in range(seq.shape[-1]):
            self.seq_scalers.append(StandardScaler().fit(seq[:, :, c].reshape(-1, 1)))

    def _scale_seq(self, seq: np.ndarray) -> np.ndarray:
        out = seq.astype(float).copy()
        n, w, ch = out.shape
        for c in range(ch):
            out[:, :, c] = self.seq_scalers[c].transform(out[:, :, c].reshape(-1, 1)).reshape(n, w)
        return out

    # -------------------------------------------------------------- public API
    def fit(self, df: pd.DataFrame) -> "Preprocessor":
        df = self._add_derived(df)

        # Weather (impute -> fit per-channel scalers)
        self.weather_imputer.fit(df[ALL_WEATHER_COLS])
        wdf = pd.DataFrame(
            self.weather_imputer.transform(df[ALL_WEATHER_COLS]),
            columns=ALL_WEATHER_COLS, index=df.index,
        )
        self._fit_seq_scalers(self._build_sequence(wdf))

        # Static numeric (impute -> scale)
        self.num_imputer.fit(df[NUMERIC_STATIC])
        self.num_scaler.fit(self.num_imputer.transform(df[NUMERIC_STATIC]))

        # Static categorical (impute -> one-hot)
        self.cat_imputer.fit(df[CATEGORICAL_STATIC])
        self.encoder.fit(self.cat_imputer.transform(df[CATEGORICAL_STATIC]))

        cat_names = list(self.encoder.get_feature_names_out(CATEGORICAL_STATIC))
        self.static_feature_names = list(NUMERIC_STATIC) + cat_names
        self.fitted = True
        return self

    def transform(self, df: pd.DataFrame):
        if not self.fitted:
            raise RuntimeError("Preprocessor must be fitted before calling transform().")
        df = self._add_derived(df)

        wdf = pd.DataFrame(
            self.weather_imputer.transform(df[ALL_WEATHER_COLS]),
            columns=ALL_WEATHER_COLS, index=df.index,
        )
        X_seq = self._scale_seq(self._build_sequence(wdf)).astype("float32")

        num = self.num_scaler.transform(self.num_imputer.transform(df[NUMERIC_STATIC]))
        cat = self.encoder.transform(self.cat_imputer.transform(df[CATEGORICAL_STATIC]))
        X_static = np.hstack([num, cat]).astype("float32")

        y = df[TARGET].to_numpy(dtype="float32") if TARGET in df.columns else None
        return X_static, X_seq, y

    def fit_transform(self, df: pd.DataFrame):
        return self.fit(df).transform(df)

    # ------------------------------------------------------------- persistence
    def save(self, path) -> None:
        joblib.dump(self, path)

    @classmethod
    def load(cls, path) -> "Preprocessor":
        return joblib.load(path)
