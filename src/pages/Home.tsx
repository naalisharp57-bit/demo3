import {
  Sprout,
  Brain,
  Database,
  LineChart,
  Layers,
  Terminal,
  FlaskConical,
  ArrowRight,
  Cpu,
  ClipboardList,
} from "lucide-react";
import cropHero from "@/assets/crop-hero.png";

const PIPELINE = [
  { icon: Database, title: "Data", desc: "Synthetic soil, crop & 10-week weather series" },
  { icon: Layers, title: "Preprocess", desc: "Impute, scale, one-hot, reshape for LSTM" },
  { icon: Brain, title: "Model", desc: "MLP + LSTM two-branch regression" },
  { icon: LineChart, title: "Evaluate", desc: "MAE / RMSE / R² vs baselines" },
  { icon: ClipboardList, title: "Advise", desc: "Rule-based farming recommendations" },
];

const COMMANDS = [
  { cmd: "pip install -r requirements.txt", note: "Install dependencies" },
  { cmd: "python -m src.generate_data", note: "Create data/crop_yield.csv" },
  { cmd: "python -m src.train", note: "Train, evaluate & save the model" },
  { cmd: "python app/app.py", note: "Launch Flask at localhost:5000" },
];

const STRUCTURE = `crop-yield-dss/
├── data/            # CSV datasets
├── models/          # saved model + preprocessor
├── src/
│   ├── config.py        # feature schema & paths
│   ├── generate_data.py # synthetic dataset
│   ├── preprocessing.py # fit/transform pipeline
│   ├── model.py         # MLP + LSTM
│   ├── baselines.py     # LinearReg / RandomForest
│   ├── train.py         # training workflow
│   └── recommend.py     # decision support
├── app/             # Flask app + templates
└── requirements.txt`;

export default function Home() {
  return (
    <div className="min-h-screen bg-emerald-50 font-sans text-emerald-950">
      {/* Hero */}
      <header className="relative overflow-hidden">
        <img
          src={cropHero}
          alt="Aerial farmland merging with data visualisations"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/90 via-emerald-900/80 to-emerald-800/60" />
        <div className="relative mx-auto max-w-5xl px-6 py-24 md:py-32">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/40 bg-emerald-500/15 px-4 py-1.5 text-sm font-semibold text-emerald-50 backdrop-blur">
            <Cpu className="h-4 w-4" /> Python · TensorFlow/Keras · Flask
          </span>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            Crop Yield Prediction &amp; Decision Support System
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-emerald-50/90">
            A deep-learning prototype that estimates yield from soil, crop and weather
            data, then gives farmers tailored recommendations. A two-branch model
            (MLP&nbsp;+&nbsp;LSTM) served through a simple Flask interface.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a
              href="#run"
              className="inline-flex h-12 items-center gap-2 rounded-full bg-amber-400 px-6 font-bold text-emerald-950 shadow-lg transition-transform hover:-translate-y-0.5"
            >
              How to run <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#architecture"
              className="inline-flex h-12 items-center rounded-full border border-white/30 px-6 font-semibold text-white transition-colors hover:bg-white/10"
            >
              View architecture
            </a>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm text-emerald-100/80">
            <Terminal className="h-4 w-4" />
            Source lives in <code className="rounded bg-black/30 px-1.5 py-0.5">crop-yield-dss/</code> — run it locally (not in this preview).
          </p>
        </div>
      </header>

      {/* Pipeline */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">End-to-end workflow</h2>
        <p className="mx-auto mt-3 max-w-2xl text-center text-emerald-800/80">
          From raw field data to an actionable recommendation.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PIPELINE.map((step, i) => (
            <div
              key={step.title}
              className="relative rounded-2xl border border-emerald-100 bg-white p-6 shadow-sm transition-transform hover:-translate-y-1"
            >
              <span className="absolute right-4 top-4 text-sm font-bold text-emerald-200">
                {String(i + 1).padStart(2, "0")}
              </span>
              <step.icon className="h-8 w-8 text-emerald-600" />
              <h3 className="mt-4 font-bold">{step.title}</h3>
              <p className="mt-1 text-sm text-emerald-800/70">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Architecture */}
      <section id="architecture" className="border-y border-emerald-100 bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-2">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-emerald-600">
              Model
            </p>
            <h2 className="mt-3 text-2xl font-bold sm:text-3xl">
              A two-branch network built for mixed data
            </h2>
            <p className="mt-4 text-emerald-800/80">
              Soil and static crop attributes flow through a dense MLP, while the weekly
              weather sequence is read by stacked LSTM layers. The branches are fused and
              regressed to a single yield value.
            </p>
            <div className="mt-6 space-y-4">
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                <Sprout className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold">Static branch (MLP)</p>
                  <p className="text-sm text-emerald-800/70">
                    pH, N-P-K, organic carbon, crop type, location, sowing day.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-xl bg-emerald-50 p-4">
                <LineChart className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600" />
                <div>
                  <p className="font-semibold">Weather branch (LSTM)</p>
                  <p className="text-sm text-emerald-800/70">
                    10 weekly timesteps × 3 channels: rainfall, temperature, humidity.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-emerald-950 p-6 text-emerald-50 shadow-lg">
            <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-emerald-300">
              <FlaskConical className="h-4 w-4" /> Compared against baselines
            </p>
            <pre className="overflow-x-auto text-sm leading-relaxed">
{`[static] --> Dense(64) -> Dense(32) --\\
                                       concat -> Dense(32) -> yield
[weather] -> LSTM(64) -> LSTM(32) ----/

Baselines : LinearRegression, RandomForest
Metrics   : MAE, RMSE, R2
Ablation  : static-only vs weather-only`}
            </pre>
          </div>
        </div>
      </section>

      {/* Run */}
      <section id="run" className="mx-auto max-w-4xl px-6 py-16">
        <h2 className="text-2xl font-bold sm:text-3xl">Run it locally</h2>
        <p className="mt-3 text-emerald-800/80">
          Requires Python 3.10 or 3.11. Execute from the <code className="rounded bg-emerald-100 px-1.5 py-0.5">crop-yield-dss/</code> folder.
        </p>
        <ol className="mt-8 space-y-3">
          {COMMANDS.map((c, i) => (
            <li key={c.cmd} className="flex items-center gap-4 rounded-xl border border-emerald-100 bg-white p-4 shadow-sm">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <code className="flex-1 font-mono text-sm text-emerald-900">{c.cmd}</code>
              <span className="hidden text-sm text-emerald-700/70 sm:block">{c.note}</span>
            </li>
          ))}
        </ol>

        <h3 className="mt-12 text-lg font-bold">Project structure</h3>
        <pre className="mt-4 overflow-x-auto rounded-2xl bg-emerald-950 p-6 text-sm leading-relaxed text-emerald-50">
{STRUCTURE}
        </pre>
      </section>

      <footer className="border-t border-emerald-100 bg-white">
        <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-emerald-800/70">
          Crop Yield Prediction &amp; Decision Support · Deep-learning prototype (TensorFlow · Flask).
        </div>
      </footer>
    </div>
  );
}
