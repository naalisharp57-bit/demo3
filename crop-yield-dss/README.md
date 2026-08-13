# Crop Yield Prediction & Decision Support System (Prototype)

A deep-learning prototype that predicts **crop yield (tons/ha)** from soil, crop
and weather data, then turns the prediction into **farmer-friendly recommendations**
through a small **Flask** web app.

- **Model:** multi-branch network — an **MLP** for static/tabular features + an
  **LSTM** for the weekly weather time-series (TensorFlow/Keras).
- **Baselines:** Linear Regression and Random Forest (scikit-learn).
- **Decision support:** rule-based advice on top of the numeric prediction.

> This is a Python project. It runs locally with Python 3.10/3.11 — it does **not**
> run inside the OnSpace browser preview.

---

## 1. Project structure (Step 9)

```
crop-yield-dss/
├── data/                      # generated / real CSV files (created on first run)
│   └── crop_yield.csv
├── models/                    # saved model + preprocessor (created by training)
│   ├── crop_yield_model.keras
│   ├── preprocessor.joblib
│   └── training_curve.png
├── src/                       # reusable library code
│   ├── config.py              # feature schema, paths, thresholds (single source of truth)
│   ├── generate_data.py       # (Step 2) synthetic dataset generator
│   ├── preprocessing.py       # (Step 3) fit/transform pipeline (shared train + inference)
│   ├── model.py               # (Step 4) MLP + LSTM model + ablation variants
│   ├── baselines.py           # (Step 5) Linear Regression / Random Forest
│   ├── train.py               # (Step 6) training, evaluation, ablation
│   └── recommend.py           # (Step 7) decision-support rules
├── app/                       # (Step 8) Flask web app
│   ├── app.py
│   ├── templates/{index,result}.html
│   └── static/style.css
├── requirements.txt
└── README.md
```

---

## 2. Quickstart

```bash
# from the crop-yield-dss/ folder
python -m venv .venv && source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt

python -m src.generate_data     # 1) create data/crop_yield.csv
python -m src.train             # 2) train + evaluate + save model & preprocessor
python app/app.py               # 3) launch the web app -> http://localhost:5000
```

`train.py` prints test-set **MAE / RMSE / R²** for the deep model, the baselines,
and the ablation study, and saves a `training_curve.png`.

---

## 3. Data schema (Step 1 & 2)

| Group     | Columns |
|-----------|---------|
| Static    | `year`, `location`, `crop_type`, `sowing_date`, `soil_ph`, `soil_n`, `soil_p`, `soil_k`, `org_carbon` |
| Weather   | `weekly_rainfall_1..10`, `weekly_temp_1..10`, `weekly_humidity_1..10` |
| Target    | `yield` (tons/ha) |

**Model inputs** (produced by `Preprocessor.transform`):
- `X_static` — shape `(n, n_features)` after imputation, scaling and one-hot encoding.
- `X_seq` — shape `(n, 10, 3)`: 10 weekly timesteps × 3 channels (rainfall, temp, humidity).

---

## 4. Why preprocessing is reusable (Step 3 & 9)

`Preprocessor` follows the classic **fit / transform** pattern and is saved with
`joblib`. Training fits it on the **train split only**; the Flask app loads the same
object (`models/preprocessor.joblib`) so inference uses identical imputers, scalers
and encoders. This prevents train/serve skew.

---

## 5. Extending the prototype

- **Real data:** drop a CSV with the schema above into `data/crop_yield.csv` and
  skip `generate_data`. Add unseen crops/locations to `config.py`.
- **Richer weather:** add channels (e.g. solar radiation) in `config.py` and
  `preprocessing._build_sequence`.
- **Smarter advice:** extend the rules in `recommend.py` (e.g. crop-specific pH bands).
- **Serving:** add a JSON `/api/predict` route, or containerize with Docker.

---

## 6. Notes for a report

Structure the write-up as: **Problem → Data → Preprocessing → Model → Baselines →
Results (MAE/RMSE/R² table + ablation) → Decision Support → Web App → Limitations
& Future Work**. Use the metrics printed by `train.py` and `models/training_curve.png`
as evidence that the multi-branch model improves over the baselines and that both
data types (soil + weather) contribute.
