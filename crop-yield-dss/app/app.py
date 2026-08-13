"""
Step 8 - Flask web app.

Routes:
  GET  /         -> input form (templates/index.html)
  POST /predict  -> preprocess -> model.predict -> recommend -> result page

The form is simplified for farmers: instead of 30 weekly weather cells, they
enter average weekly rainfall/temperature/humidity, which we expand into the
full WEEKS-length series the model expects.

Run (from the crop-yield-dss/ project root, AFTER training):
    python app/app.py
Then open http://localhost:5000
"""
import sys
from pathlib import Path
from datetime import date

# Make the 'src' package importable no matter where python is launched from.
ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

import pandas as pd
import tensorflow as tf
from flask import Flask, render_template, request

from src.preprocessing import Preprocessor
from src.recommend import recommend
from src.config import (
    MODEL_PATH, PREPROCESSOR_PATH, RAINFALL_COLS, TEMP_COLS, HUMIDITY_COLS,
    CROP_TYPES, LOCATIONS,
)

app = Flask(__name__)

# Lazy singletons so the model/preprocessor load once, on first request.
_model = None
_pre = None


def get_model():
    global _model
    if _model is None:
        # compile=False -> no need to register the custom rmse metric for inference.
        _model = tf.keras.models.load_model(str(MODEL_PATH), compile=False)
    return _model


def get_pre() -> Preprocessor:
    global _pre
    if _pre is None:
        _pre = Preprocessor.load(PREPROCESSOR_PATH)
    return _pre


def build_input_row(form):
    """Expand the simplified form into the full training schema."""
    avg_rain = float(form["avg_rainfall"])
    avg_temp = float(form["avg_temp"])
    avg_hum = float(form.get("avg_humidity", 65))

    row = {
        "year": date.today().year,
        "location": form["location"],
        "crop_type": form["crop_type"],
        "sowing_date": form["sowing_date"],
        "soil_ph": float(form["soil_ph"]),
        "soil_n": float(form["soil_n"]),
        "soil_p": float(form["soil_p"]),
        "soil_k": float(form["soil_k"]),
        "org_carbon": float(form["org_carbon"]),
    }
    for col in RAINFALL_COLS:
        row[col] = avg_rain
    for col in TEMP_COLS:
        row[col] = avg_temp
    for col in HUMIDITY_COLS:
        row[col] = avg_hum

    weather = {"avg_rainfall": avg_rain, "avg_temp": avg_temp}
    return row, weather


@app.route("/")
def index():
    return render_template("index.html", crops=CROP_TYPES, locations=LOCATIONS)


@app.route("/predict", methods=["POST"])
def predict():
    row, weather = build_input_row(request.form)
    df = pd.DataFrame([row])

    X_static, X_seq, _ = get_pre().transform(df)
    pred = float(get_model().predict([X_static, X_seq], verbose=0).ravel()[0])
    pred = max(0.0, round(pred, 2))

    features = {
        "soil_ph": row["soil_ph"], "soil_n": row["soil_n"], "soil_p": row["soil_p"],
        "soil_k": row["soil_k"], "org_carbon": row["org_carbon"],
        "avg_rainfall": weather["avg_rainfall"], "avg_temp": weather["avg_temp"],
        "crop_type": row["crop_type"],
    }
    advice = recommend(pred, features)
    return render_template("result.html", pred=pred, advice=advice, crop=row["crop_type"])


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)
