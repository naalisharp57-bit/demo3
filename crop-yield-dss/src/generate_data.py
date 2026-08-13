"""
Step 2 - Synthetic dataset generator.

Creates a small, LEARNABLE example dataset that follows the target schema so
the whole pipeline can be run end-to-end without a real dataset.

Run:  python -m src.generate_data
Output: data/crop_yield.csv
"""
import numpy as np
import pandas as pd

from .config import (
    WEEKS, RAINFALL_COLS, TEMP_COLS, HUMIDITY_COLS,
    CROP_TYPES, LOCATIONS, DATA_DIR, DATA_PATH,
)

# Per-crop agronomic profile: base yield (t/ha) and optimal weather.
CROP_PROFILE = {
    "wheat":   {"base": 3.5, "opt_temp": 18, "opt_rain": 45},
    "rice":    {"base": 4.5, "opt_temp": 27, "opt_rain": 90},
    "maize":   {"base": 5.5, "opt_temp": 24, "opt_rain": 60},
    "cotton":  {"base": 2.5, "opt_temp": 28, "opt_rain": 50},
    "soybean": {"base": 2.8, "opt_temp": 25, "opt_rain": 55},
}

# Small regional bias so 'location' carries a weak (but real) signal.
LOC_BIAS = {"north": 0.0, "south": 0.2, "east": -0.1, "west": 0.1, "central": 0.05}


def generate(n_samples: int = 1500, seed: int = 42) -> pd.DataFrame:
    """Return a DataFrame of synthetic fields with a realistic yield relationship."""
    rng = np.random.default_rng(seed)
    rows = []

    for _ in range(n_samples):
        crop = str(rng.choice(CROP_TYPES))
        loc = str(rng.choice(LOCATIONS))
        year = int(rng.integers(2015, 2024))
        prof = CROP_PROFILE[crop]

        # --- soil ---
        soil_ph = round(float(rng.normal(6.5, 0.7)), 2)
        soil_n = round(float(rng.normal(80, 25)), 1)     # kg/ha
        soil_p = round(float(rng.normal(40, 15)), 1)     # kg/ha
        soil_k = round(float(rng.normal(50, 18)), 1)     # kg/ha
        org_carbon = round(float(rng.normal(0.7, 0.25)), 2)  # %

        # --- sowing date ---
        month = int(rng.integers(5, 8))
        day = int(rng.integers(1, 28))
        sowing_date = f"{year}-{month:02d}-{day:02d}"

        # --- weekly weather around the crop optimum ---
        base_temp = prof["opt_temp"] + rng.normal(0, 3)
        base_rain = prof["opt_rain"] + rng.normal(0, 15)
        rain = np.clip(rng.normal(base_rain, 12, WEEKS), 0, None)
        temp = rng.normal(base_temp, 2.5, WEEKS)
        hum = np.clip(rng.normal(65, 10, WEEKS), 20, 100)

        # --- ground-truth yield model (with penalties for deviating from optimum) ---
        total_rain = float(rain.sum())
        avg_temp = float(temp.mean())
        temp_pen = -0.06 * (avg_temp - prof["opt_temp"]) ** 2
        rain_target = prof["opt_rain"] * WEEKS
        rain_pen = -0.0009 * (total_rain - rain_target) ** 2 / WEEKS
        ph_pen = -0.4 * (soil_ph - 6.5) ** 2
        fertility = 0.006 * soil_n + 0.004 * soil_p + 0.003 * soil_k + 0.8 * org_carbon

        y = prof["base"] + fertility + temp_pen + rain_pen + ph_pen + LOC_BIAS[loc]
        y += rng.normal(0, 0.3)                 # observation noise
        y = max(0.2, round(float(y), 3))        # clip to a sensible floor

        row = {
            "year": year, "location": loc, "crop_type": crop,
            "sowing_date": sowing_date, "soil_ph": soil_ph,
            "soil_n": soil_n, "soil_p": soil_p, "soil_k": soil_k,
            "org_carbon": org_carbon,
        }
        for i in range(WEEKS):
            row[RAINFALL_COLS[i]] = round(float(rain[i]), 2)
        for i in range(WEEKS):
            row[TEMP_COLS[i]] = round(float(temp[i]), 2)
        for i in range(WEEKS):
            row[HUMIDITY_COLS[i]] = round(float(hum[i]), 2)
        row["yield"] = y
        rows.append(row)

    return pd.DataFrame(rows)


def main() -> None:
    DATA_DIR.mkdir(parents=True, exist_ok=True)
    df = generate()
    df.to_csv(DATA_PATH, index=False)

    # Basic inspection (Step 2 requirement).
    print(f"Saved {len(df)} rows -> {DATA_PATH}\n")
    print("Column dtypes:\n", df.dtypes, "\n")
    print("Numeric summary:\n", df.describe().T[["mean", "std", "min", "max"]])


if __name__ == "__main__":
    main()
