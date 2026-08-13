"""
Central configuration: feature schema, file paths and constants.

Keeping everything here guarantees the SAME feature definitions are used for
data generation, training and Flask inference (single source of truth).
"""
from pathlib import Path

# --- Time-series window -------------------------------------------------------
WEEKS = 10  # number of weekly weather timesteps fed to the LSTM branch

# --- Paths (resolved relative to the project root, not the current directory) --
ROOT = Path(__file__).resolve().parents[1]          # .../crop-yield-dss
DATA_DIR = ROOT / "data"
MODELS_DIR = ROOT / "models"
DATA_PATH = DATA_DIR / "crop_yield.csv"
MODEL_PATH = MODELS_DIR / "crop_yield_model.keras"  # trained Keras model
PREPROCESSOR_PATH = MODELS_DIR / "preprocessor.joblib"

# --- Weather time-series columns (grouped per channel) ------------------------
RAINFALL_COLS = [f"weekly_rainfall_{i}" for i in range(1, WEEKS + 1)]
TEMP_COLS = [f"weekly_temp_{i}" for i in range(1, WEEKS + 1)]
HUMIDITY_COLS = [f"weekly_humidity_{i}" for i in range(1, WEEKS + 1)]
ALL_WEATHER_COLS = RAINFALL_COLS + TEMP_COLS + HUMIDITY_COLS
WEATHER_CHANNELS = ["rainfall", "temp", "humidity"]  # LSTM input channels (order matters)

# --- Static / tabular features ------------------------------------------------
# 'sowing_doy' (day-of-year) is DERIVED from 'sowing_date' during preprocessing.
NUMERIC_STATIC = ["soil_ph", "soil_n", "soil_p", "soil_k", "org_carbon", "sowing_doy"]
CATEGORICAL_STATIC = ["crop_type", "location"]
TARGET = "yield"  # tons per hectare

# --- Vocabulary (used by the synthetic generator and the Flask dropdowns) ------
CROP_TYPES = ["wheat", "rice", "maize", "cotton", "soybean"]
LOCATIONS = ["north", "south", "east", "west", "central"]

# --- Decision-support thresholds (tons/ha) ------------------------------------
YIELD_LOW = 2.5   # below this  -> "Low"
YIELD_HIGH = 4.5  # at/above    -> "High"; between the two -> "Medium"
