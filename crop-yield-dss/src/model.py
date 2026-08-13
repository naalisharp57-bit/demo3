"""
Step 4 - Deep learning model (multi-branch: MLP + LSTM).

  static features --> [Dense MLP]  \
                                    concat --> Dense --> yield (linear)
  weather series  --> [LSTM]       /

The model takes TWO inputs, in this order: [X_static, X_seq].
Keep that order everywhere you call fit()/predict().
"""
import tensorflow as tf
from tensorflow.keras import Input, Model, layers
from tensorflow.keras.optimizers import Adam


def rmse(y_true, y_pred):
    """Custom Root Mean Squared Error metric (same units as yield)."""
    return tf.sqrt(tf.reduce_mean(tf.square(y_true - y_pred)))


def build_model(n_static: int, n_timesteps: int, n_channels: int, lr: float = 1e-3) -> Model:
    """Full two-branch model.

    Args:
        n_static:    number of static/tabular features (after encoding).
        n_timesteps: weather sequence length (WEEKS).
        n_channels:  weather channels per timestep (rainfall, temp, humidity = 3).
    """
    # --- Branch 1: static/tabular features (MLP) ---
    static_in = Input(shape=(n_static,), name="static_input")
    s = layers.Dense(64, activation="relu")(static_in)
    s = layers.Dropout(0.2)(s)
    s = layers.Dense(32, activation="relu")(s)

    # --- Branch 2: weather time-series (LSTM) ---
    seq_in = Input(shape=(n_timesteps, n_channels), name="sequence_input")
    t = layers.LSTM(64, return_sequences=True)(seq_in)
    t = layers.LSTM(32)(t)
    t = layers.Dense(16, activation="relu")(t)

    # --- Fusion + regression head ---
    x = layers.concatenate([s, t])
    x = layers.Dense(32, activation="relu")(x)
    x = layers.Dropout(0.2)(x)
    out = layers.Dense(1, activation="linear", name="yield")(x)

    model = Model(inputs=[static_in, seq_in], outputs=out)
    model.compile(optimizer=Adam(lr), loss="mse", metrics=["mae", rmse])
    return model


# --- Ablation helpers (Step 6): single-branch variants ------------------------
def build_static_only(n_static: int, lr: float = 1e-3) -> Model:
    inp = Input(shape=(n_static,))
    x = layers.Dense(64, activation="relu")(inp)
    x = layers.Dropout(0.2)(x)
    x = layers.Dense(32, activation="relu")(x)
    out = layers.Dense(1, activation="linear")(x)
    m = Model(inp, out)
    m.compile(optimizer=Adam(lr), loss="mse", metrics=["mae", rmse])
    return m


def build_seq_only(n_timesteps: int, n_channels: int, lr: float = 1e-3) -> Model:
    inp = Input(shape=(n_timesteps, n_channels))
    x = layers.LSTM(64, return_sequences=True)(inp)
    x = layers.LSTM(32)(x)
    x = layers.Dense(16, activation="relu")(x)
    out = layers.Dense(1, activation="linear")(x)
    m = Model(inp, out)
    m.compile(optimizer=Adam(lr), loss="mse", metrics=["mae", rmse])
    return m
