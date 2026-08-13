"""
Step 7 - Decision-support (rule-based recommendation layer).

Turns a numeric prediction + raw inputs into a qualitative label and concrete,
farmer-friendly advice. Intentionally simple so it is easy to extend later.
"""
from .config import YIELD_LOW, YIELD_HIGH


def qualitative_label(pred_yield: float) -> str:
    """Map a numeric yield (t/ha) to Low / Medium / High."""
    if pred_yield >= YIELD_HIGH:
        return "High"
    if pred_yield >= YIELD_LOW:
        return "Medium"
    return "Low"


def recommend(pred_yield: float, features: dict) -> dict:
    """Build recommendations from the prediction and key inputs.

    Args:
        pred_yield: model output in t/ha.
        features:   dict with soil_ph, soil_n, soil_p, soil_k, org_carbon,
                    avg_rainfall, avg_temp, crop_type (any subset is fine).

    Returns:
        {"label": str, "headline": str, "tips": [str, ...]}
    """
    label = qualitative_label(pred_yield)
    tips: list[str] = []

    # --- Soil-based advice ---
    ph = features.get("soil_ph")
    if ph is not None:
        if ph < 5.8:
            tips.append("Soil is acidic (pH < 5.8). Apply agricultural lime to raise pH toward 6.5.")
        elif ph > 7.5:
            tips.append("Soil is alkaline (pH > 7.5). Add organic matter or gypsum to lower pH.")
    if features.get("soil_n", 100) < 60:
        tips.append("Nitrogen is low. Apply a nitrogen-rich fertilizer (e.g. urea) or use a legume cover crop.")
    if features.get("soil_p", 100) < 25:
        tips.append("Phosphorus is low. Consider DAP/SSP application at sowing.")
    if features.get("soil_k", 100) < 30:
        tips.append("Potassium is low. Apply muriate of potash (MOP) as recommended.")
    if features.get("org_carbon", 1) < 0.5:
        tips.append("Organic carbon is low. Add compost / farmyard manure to improve soil health.")

    # --- Weather-based advice ---
    rain = features.get("avg_rainfall")
    if rain is not None:
        if rain < 30:
            tips.append("Rainfall looks low. Plan supplemental irrigation at critical growth stages.")
        elif rain > 100:
            tips.append("Rainfall is high. Ensure drainage to avoid waterlogging and fungal disease.")
    temp = features.get("avg_temp")
    if temp is not None and (temp < 12 or temp > 34):
        tips.append("Temperature is outside the comfortable range. Adjust the sowing window or pick a tolerant variety.")

    # --- Yield-band headline ---
    if label == "High":
        headline = "Conditions are favorable. Maintain current practices and keep monitoring."
    elif label == "Medium":
        headline = "Moderate yield expected. Optimize fertilizer and irrigation to reach the higher band."
    else:
        headline = ("Low yield expected. Likely causes: poor soil fertility or sub-optimal weather. "
                    "Act on the recommendations below, or consider an alternative crop.")

    if not tips:
        tips.append("No major issues detected in the inputs. Keep monitoring soil moisture and pests.")

    return {"label": label, "headline": headline, "tips": tips}
