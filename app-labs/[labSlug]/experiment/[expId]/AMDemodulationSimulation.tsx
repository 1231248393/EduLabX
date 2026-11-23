"use client";

import { useCallback, useEffect, useMemo, useState, type CSSProperties } from "react";
import AMCircuitWorkbench, { type AMSettingKey } from "./AMCircuitWorkbench";

export type AMSettings = {
  messageHz: number;
  carrierHz: number;
  modulation: number;
  amplitude: number;
  capacitanceNf: number;
  load: "RL1" | "RL2";
  rl1Ohms: number;
  rl2Ohms: number;
  diodeDrop: number;
};

type Sample = { t: number; message: number; am: number; rectified: number; output: number };
type Simulation = { samples: Sample[]; tau: number; loadOhms: number };
type ChannelStats = { rms: number; peak: number; peakToPeak: number; min: number; max: number; frequency: number | null };

const STORAGE_KEY = "edulabx:practical:am-demodulation:v1";
const DEFAULTS: AMSettings = {
  messageHz: 50,
  carrierHz: 1000,
  modulation: 0.7,
  amplitude: 2,
  capacitanceNf: 10,
  load: "RL1",
  rl1Ohms: 47000,
  rl2Ohms: 4700,
  diodeDrop: 0.65,
};

const card: CSSProperties = {
  background: "#fff", border: "1px solid #dbe4ec", borderRadius: 14,
  boxShadow: "0 8px 24px rgba(16,38,56,.055)",
};
const label: CSSProperties = { color: "#334155", fontSize: 12, fontWeight: 700 };

function solveDetector(settings: AMSettings, durationSeconds: number, phaseSeconds: number): Simulation {
  const loadOhms = settings.load === "RL1" ? settings.rl1Ohms : settings.rl2Ohms;
  const capacitance = settings.capacitanceNf * 1e-9;
  const tau = loadOhms * capacitance;
  const dt = Math.min(durationSeconds / 1400, 1 / (settings.carrierHz * 35));
  const count = Math.max(2, Math.ceil(durationSeconds / dt));
  const warmupSteps = Math.ceil((6 / settings.messageHz) / dt);
  let capacitorVoltage = 0;

  const advance = (time: number) => {
    const message = Math.cos(2 * Math.PI * settings.messageHz * time);
    const envelope = settings.amplitude * (1 + settings.modulation * message);
    const carrier = Math.sin(2 * Math.PI * settings.carrierHz * time);
    const input = envelope * carrier;
    const rectified = Math.max(0, input - settings.diodeDrop);
    // Piecewise silicon-diode model: the capacitor charges when the input
    // exceeds its stored voltage, then discharges through the selected RL.
    const available = input - settings.diodeDrop;
    if (available > capacitorVoltage) capacitorVoltage = available;
    else capacitorVoltage *= Math.exp(-dt / Math.max(tau, 1e-9));
    return { message: settings.amplitude * settings.modulation * message, am: input, rectified, output: capacitorVoltage };
  };

  const start = phaseSeconds - 6 / settings.messageHz;
  for (let i = 0; i < warmupSteps; i += 1) advance(start + i * dt);
  const samples: Sample[] = [];
  for (let i = 0; i <= count; i += 1) {
    const t = i * durationSeconds / count;
    samples.push({ t, ...advance(phaseSeconds + t) });
  }
  return { samples, tau, loadOhms };
}

function pathFor(values: number[], width: number, height: number, minValue?: number, maxValue?: number) {
  if (!values.length) return "";
  const low = minValue ?? Math.min(...values);
  const high = maxValue ?? Math.max(...values);
  const span = Math.max(high - low, 0.01);
  return values.map((value, i) => {
    const x = (i / Math.max(1, values.length - 1)) * width;
    const y = height - ((value - low) / span) * (height - 12) - 6;
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function scopePath(values: number[], width: number, height: number, voltsPerDivision: number, verticalPosition: number) {
  if (!values.length) return "";
  const center = height / 2;
  const pixelsPerDivision = height / 4;
  return values.map((value, i) => {
    const x = (i / Math.max(1, values.length - 1)) * width;
    const rawY = center - ((value - verticalPosition) / voltsPerDivision) * pixelsPerDivision;
    const y = Math.max(1, Math.min(height - 1, rawY));
    return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
}

function stats(values: number[], durationSeconds: number): ChannelStats {
  if (!values.length) return { rms: 0, peak: 0, peakToPeak: 0, min: 0, max: 0, frequency: null };
  const min = Math.min(...values);
  const max = Math.max(...values);
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const rms = Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / values.length);
  let crossings = 0;
  for (let i = 1; i < values.length; i += 1) {
    if (values[i - 1] <= mean && values[i] > mean) crossings += 1;
  }
  const frequency = crossings > 0 ? crossings / durationSeconds : null;
  return { rms, peak: Math.max(Math.abs(min), Math.abs(max)), peakToPeak: max - min, min, max, frequency };
}

function WavePanel({ title, color, values, times, unit, description }: {
  title: string; color: string; values: number[]; times: number[]; unit: string; description: string;
}) {
  const min = values.length ? Math.min(...values) : -1;
  const max = values.length ? Math.max(...values) : 1;
  const path = pathFor(values, 720, 150, min, max);
  return (
    <section style={{ ...card, padding: 14, minWidth: 0 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline", marginBottom: 5 }}>
        <strong style={{ color: "#102638", fontSize: 13 }}>{title}</strong>
        <span style={{ color: "#64748b", fontSize: 10 }}>{description}</span>
      </div>
      <svg viewBox="0 0 720 150" role="img" aria-label={`${title} waveform`} style={{ width: "100%", display: "block", background: "#081521", borderRadius: 8 }}>
        {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 72} x2={i * 72} y1="0" y2="150" stroke="#1e3444" strokeWidth="1" />)}
        {Array.from({ length: 7 }, (_, i) => <line key={`h${i}`} x1="0" x2="720" y1={i * 25} y2={i * 25} stroke="#1e3444" strokeWidth="1" />)}
        <path d={path} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: "flex", justifyContent: "space-between", color: "#64748b", fontSize: 10, paddingTop: 5 }}>
        <span>{values.length ? `${min.toFixed(2)} ${unit}` : "—"}</span>
        <span>{times.length ? `${(times[times.length - 1] * 1000).toFixed(1)} ms window` : "Waiting for simulation"}</span>
        <span>{values.length ? `${max.toFixed(2)} ${unit}` : "—"}</span>
      </div>
    </section>
  );
}

export function AMDetectorDiagram({ load = "RL1", rl1Ohms = 47000, rl2Ohms = 4700 }: { load?: "RL1" | "RL2"; rl1Ohms?: number; rl2Ohms?: number }) {
  const active = "#0b78a5";
  const inactive = "#8795a2";
  return (
    <svg viewBox="0 0 820 340" role="img" aria-label={`AM envelope detector circuit, ${load} selected`} style={{ width: "100%", maxWidth: 880, height: "auto" }}>
      <g fill="none" stroke="#334155" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M94 112H206" /><path d="M244 112H402" />
        <path d="M402 112H480" />
        <path d="M480 112V174" /><path d="M460 174H500M460 184H500" /><path d="M480 184V210" />
        <path d="M402 112H550" />
        <path d={load === "RL1" ? "M550 112L610 66" : "M550 112L610 158"} stroke={active} strokeWidth="4" />
        <circle cx="550" cy="112" r="5" fill="#334155" />
        <circle cx="610" cy="66" r="5" fill={load === "RL1" ? active : "#fff"} />
        <circle cx="610" cy="158" r="5" fill={load === "RL2" ? active : "#fff"} />
        <path d="M610 66H650V88" stroke={load === "RL1" ? active : inactive} />
        <path d="M650 88L660 78L670 98L680 78L690 98L700 78L710 98L720 88V210" stroke={load === "RL1" ? active : inactive} />
        <path d="M610 158H650V178" stroke={load === "RL2" ? active : inactive} />
        <path d="M650 178L660 168L670 188L680 168L690 188L700 168L710 188L720 178V210" stroke={load === "RL2" ? active : inactive} />
        <path d="M94 112V154" /><circle cx="94" cy="176" r="22" fill="#fff" /><path d="M94 198V210" />
        <path d="M84 176Q89 160 94 176T104 176" stroke="#0891b2" strokeWidth="2" />
        <path d="M402 112H760" stroke="#0b78a5" strokeDasharray="7 5" />
        <path d="M150 112V34H760" stroke="#0284c7" strokeDasharray="7 5" />
        <path d="M94 210H760" />
        <path d="M94 210V240" /><path d="M76 240H112M82 248H106M88 256H100" />
      </g>
      <polygon points="206,98 206,126 240,112" fill="#334155" />
      <line x1="244" y1="94" x2="244" y2="130" stroke="#334155" strokeWidth="4" />
      <g fontFamily="Arial, sans-serif" fill="#334155" fontSize="13" fontWeight="700">
        <text x="48" y="91">AM input</text><text x="211" y="82">D1</text><text x="505" y="163">C1</text>
        <text x="543" y="82">S1</text><text x="667" y="62" fill={load === "RL1" ? active : inactive}>RL1 · {(rl1Ohms / 1000).toFixed(1)} kΩ</text>
        <text x="667" y="150" fill={load === "RL2" ? active : inactive}>RL2 · {(rl2Ohms / 1000).toFixed(1)} kΩ</text>
        <text x="330" y="100">Detector output</text><text x="59" y="279">Ground</text>
        <text x="735" y="30" fill="#0284c7">CH1 +</text><text x="735" y="98" fill="#0b78a5">CH2 +</text><text x="730" y="232" fill="#64748b">CH1/CH2 −</text>
      </g>
      <text x="540" y="292" fill="#475569" fontFamily="Arial, sans-serif" fontSize="12">CH1 measures the source; CH2 measures the detector node.</text>
    </svg>
  );
}

export default function AMDemodulationSimulation() {
  const [settings, setSettings] = useState<AMSettings>(DEFAULTS);
  const [restored, setRestored] = useState(false);
  const [runState, setRunState] = useState<"stopped" | "running" | "paused">("stopped");
  const [elapsed, setElapsed] = useState(0);
  const [timeDivMs, setTimeDivMs] = useState(2);
  const [voltsDiv, setVoltsDiv] = useState(1);
  const [ch1Position, setCh1Position] = useState(0);
  const [ch2Position, setCh2Position] = useState(2);
  const [ch1Enabled, setCh1Enabled] = useState(true);
  const [ch2Enabled, setCh2Enabled] = useState(true);
  const [scopeCoupling, setScopeCoupling] = useState<"AC" | "DC">("DC");
  const [readings, setReadings] = useState<Array<{ id: number; time: number; ch1: ChannelStats; ch2: ChannelStats }>>([]);
  const [saveStatus, setSaveStatus] = useState("Loading saved settings");
  const [circuitStatus, setCircuitStatus] = useState({ valid: true, message: "Fixed AM detector topology · solver ready" });

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as Partial<AMSettings>;
        const bounded = (key: keyof AMSettings, min: number, max: number) => {
          const value = Number(parsed[key]);
          return Number.isFinite(value) ? Math.min(max, Math.max(min, value)) : DEFAULTS[key] as number;
        };
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSettings({
          messageHz: bounded("messageHz", 20, 500),
          carrierHz: bounded("carrierHz", 500, 10000),
          modulation: bounded("modulation", 0, 1.2),
          amplitude: bounded("amplitude", 0.5, 5),
          capacitanceNf: bounded("capacitanceNf", 1, 100),
          load: parsed.load === "RL2" ? "RL2" : "RL1",
          rl1Ohms: bounded("rl1Ohms", 10000, 100000),
          rl2Ohms: bounded("rl2Ohms", 1000, 10000),
          diodeDrop: bounded("diodeDrop", 0.2, 1),
        });
        setSaveStatus("Previous settings restored");
      } else setSaveStatus("Default detector circuit");
    } catch {
      setSaveStatus("Default detector circuit");
    } finally {
      setRestored(true);
    }
  }, []);

  useEffect(() => {
    if (!restored) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSaveStatus("Settings saved");
    } catch {
      setSaveStatus("Could not save settings");
    }
  }, [restored, settings]);

  useEffect(() => {
    if (runState !== "running") return;
    // Advance by a non-cycle-aligned interval. Fixed 100 ms steps made common
    // settings (for example 120 Hz and 4.4 kHz) redraw at the same phase.
    const timer = window.setInterval(() => setElapsed((value) => value + 0.034), 34);
    return () => window.clearInterval(timer);
  }, [runState]);

  const durationSeconds = timeDivMs * 10 / 1000;
  const simulation = useMemo(() => circuitStatus.valid
    ? solveDetector(settings, durationSeconds, elapsed)
    : { samples: [] as Sample[], tau: (settings.load === "RL1" ? settings.rl1Ohms : settings.rl2Ohms) * settings.capacitanceNf * 1e-9, loadOhms: settings.load === "RL1" ? settings.rl1Ohms : settings.rl2Ohms },
  [settings, durationSeconds, elapsed, circuitStatus.valid]);
  const samples = simulation.samples;
  const amValues = samples.map((s) => s.am);
  const outputValues = samples.map((s) => s.output);
  const outputMean = outputValues.reduce((sum, value) => sum + value, 0) / Math.max(1, outputValues.length);
  const plotStride = Math.max(1, Math.ceil(samples.length / 1300));
  const shownSamples = samples.filter((_, i) => i % plotStride === 0);
  const shownTimes = shownSamples.map((sample) => sample.t);
  const shown = (key: "message" | "am" | "rectified" | "output") => shownSamples.map((sample) => key === "message" ? sample.message : key === "am" ? sample.am : key === "rectified" ? sample.rectified : sample.output);
  const acCoupled = (values: number[]) => { const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length); return values.map((value) => value - mean); };
  const scopeCh1Values = scopeCoupling === "AC" ? acCoupled(amValues) : amValues;
  const scopeCh2Values = scopeCoupling === "AC" ? acCoupled(outputValues) : outputValues;
  const shownScopeCh1 = scopeCoupling === "AC" ? acCoupled(shown("am")) : shown("am");
  const shownScopeCh2 = scopeCoupling === "AC" ? acCoupled(shown("output")) : shown("output");
  const ch1Stats = stats(scopeCh1Values, durationSeconds);
  const ch2Stats = stats(scopeCh2Values, durationSeconds);
  const tauMs = simulation.tau * 1000;
  const rcRatio = settings.carrierHz * simulation.tau;

  const update = <K extends keyof AMSettings>(key: K, value: AMSettings[K]) => setSettings((current) => current[key] === value ? current : ({ ...current, [key]: value }));
  const updateNumericSetting = useCallback((key: AMSettingKey, value: number) => {
    setSettings((current) => current[key] === value ? current : ({ ...current, [key]: value }));
  }, []);
  const onCircuitValidityChange = useCallback((valid: boolean, message: string) => {
    setCircuitStatus((current) => current.valid === valid && current.message === message ? current : { valid, message });
    if (!valid) setRunState("stopped");
  }, []);
  const capture = () => setReadings((current) => [...current, { id: Date.now(), time: elapsed, ch1: ch1Stats, ch2: ch2Stats }]);
  const reset = () => { setRunState("stopped"); setElapsed(0); setReadings([]); };
  const actionButton = (text: string, onClick: () => void, color: string, disabled = false) => (
    <button type="button" onClick={onClick} disabled={disabled} style={{ border: 0, borderRadius: 8, padding: "9px 14px", color: "#fff", background: disabled ? "#94a3b8" : color, fontWeight: 750, cursor: disabled ? "not-allowed" : "pointer", fontSize: 12 }}>{text}</button>
  );
  const range = (title: string, value: number, min: number, max: number, step: number, onChange: (value: number) => void, display: string) => (
    <label style={{ display: "grid", gap: 5, marginBottom: 14 }}>
      <span style={{ ...label, display: "flex", justifyContent: "space-between", gap: 10 }}><span>{title}</span><b style={{ color: "#0b78a5" }}>{display}</b></span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} style={{ width: "100%", accentColor: "#0b78a5" }} />
    </label>
  );

  return (
    <section style={{ display: "grid", gap: 16, color: "#102638" }}>
      <div style={{ ...card, padding: 18, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <div><p style={{ margin: 0, color: "#0b78a5", fontSize: 10, fontWeight: 800, letterSpacing: ".12em" }}>AM ENVELOPE DETECTOR</p><h2 style={{ margin: "4px 0", fontSize: 21 }}>Working circuit simulation</h2><p style={{ margin: 0, color: "#64748b", fontSize: 12 }}>Numerical diode and RC detector model · {runState === "running" ? `running ${elapsed.toFixed(1)} s` : runState}</p></div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {runState === "stopped" ? actionButton("▶ Run", () => setRunState("running"), "#047857", !circuitStatus.valid) : actionButton(runState === "running" ? "Ⅱ Pause" : "▶ Resume", () => setRunState(runState === "running" ? "paused" : "running"), "#b45309", !circuitStatus.valid)}
          {actionButton("■ Stop", () => setRunState("stopped"), "#475569", runState === "stopped")}
          {actionButton("↺ Reset", reset, "#0b78a5")}
          {actionButton("Save circuit", () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); setSaveStatus("Circuit settings saved"); } catch { setSaveStatus("Could not save settings"); } }, "#1d4ed8")}
        </div>
      </div>

      <div className="am-main-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.1fr) minmax(280px, .9fr)", gap: 16, alignItems: "start" }}>
        <div style={{ ...card, padding: 16, overflow: "hidden" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 8 }}><strong style={{ fontSize: 14 }}>Detector circuit</strong><span style={{ color: circuitStatus.valid ? "#64748b" : "#b45309", fontSize: 10 }}>{circuitStatus.message}</span></div>
          <AMCircuitWorkbench settings={settings} presetSettings={DEFAULTS} onRestorePreset={() => { setSettings(DEFAULTS); setRunState("stopped"); setElapsed(0); setReadings([]); }} scopeSettings={{ timeDivMs, voltsDiv, channels: ch1Enabled && ch2Enabled ? "CH1 + CH2" : ch1Enabled ? "CH1 only" : "CH2 only", coupling: scopeCoupling }} onScopeSettingsChange={(next) => { if (next.timeDivMs != null) setTimeDivMs(next.timeDivMs); if (next.voltsDiv != null) setVoltsDiv(next.voltsDiv); if (next.channels) { setCh1Enabled(next.channels !== "CH2 only"); setCh2Enabled(next.channels !== "CH1 only"); } if (next.coupling) setScopeCoupling(next.coupling as "AC" | "DC"); }} onLoadChange={(load) => update("load", load)} onSettingChange={updateNumericSetting} onValidityChange={onCircuitValidityChange} />
        </div>

        <aside style={{ ...card, padding: 16 }}>
          <strong style={{ display: "block", fontSize: 14, marginBottom: 13 }}>Signal and component values</strong>
          {range("Message frequency", settings.messageHz, 20, 500, 5, (v) => update("messageHz", v), `${settings.messageHz} Hz`)}
          {range("Carrier frequency", settings.carrierHz, 500, 10000, 100, (v) => update("carrierHz", v), `${(settings.carrierHz / 1000).toFixed(1)} kHz`)}
          {range("Modulation index", settings.modulation, 0, 1.2, 0.05, (v) => update("modulation", v), settings.modulation.toFixed(2))}
          {range("Input carrier amplitude", settings.amplitude, 0.5, 5, 0.1, (v) => update("amplitude", v), `${settings.amplitude.toFixed(1)} V peak`)}
          {range("Detector capacitor C1", settings.capacitanceNf, 1, 100, 1, (v) => update("capacitanceNf", v), `${settings.capacitanceNf} nF`)}
          {range("Large load RL1", settings.rl1Ohms, 10000, 100000, 1000, (v) => update("rl1Ohms", v), `${(settings.rl1Ohms / 1000).toFixed(0)} kΩ`)}
          {range("Small load RL2", settings.rl2Ohms, 1000, 10000, 100, (v) => update("rl2Ohms", v), `${(settings.rl2Ohms / 1000).toFixed(1)} kΩ`)}
          {range("Diode forward drop", settings.diodeDrop, 0.2, 1, 0.01, (v) => update("diodeDrop", v), `${settings.diodeDrop.toFixed(2)} V`)}
          <div style={{ borderRadius: 9, padding: 10, background: settings.modulation > 1 ? "#fff7ed" : "#f0f9ff", color: settings.modulation > 1 ? "#9a3412" : "#075985", fontSize: 11, lineHeight: 1.5 }}>
            <b>Detector time constant:</b> τ = RC = {tauMs.toFixed(3)} ms. {settings.modulation > 1 ? "Overmodulation is selected; the envelope crosses zero and detection will be distorted." : rcRatio < 1 ? "RC is short relative to the carrier period, so carrier ripple will increase." : "Changing C1 or S1 changes the physical discharge rate and recovered envelope."}
          </div>
          <p style={{ color: "#64748b", fontSize: 10, margin: "9px 0 0" }}>{saveStatus}</p>
        </aside>
      </div>

      <div style={{ ...card, padding: 16 }}>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div><strong style={{ fontSize: 15 }}>Circuit waveforms</strong><p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 11 }}>Samples are calculated from the AM source and the same diode–capacitor–load model shown above.</p></div>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}><label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}>Time/div <select value={timeDivMs} onChange={(event) => setTimeDivMs(Number(event.target.value))} style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: 5 }}><option value={0.5}>0.5 ms</option><option value={1}>1 ms</option><option value={2}>2 ms</option><option value={5}>5 ms</option><option value={10}>10 ms</option></select></label><label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}>V/div <select value={voltsDiv} onChange={(event) => setVoltsDiv(Number(event.target.value))} style={{ border: "1px solid #cbd5e1", borderRadius: 6, padding: 5 }}><option value={0.5}>0.5 V</option><option value={1}>1 V</option><option value={2}>2 V</option><option value={5}>5 V</option></select></label><label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}>CH1 position <input aria-label="CH1 vertical position" type="range" min="-5" max="5" step="0.1" value={ch1Position} onChange={(event) => setCh1Position(Number(event.target.value))} /><span>{ch1Position.toFixed(1)} V</span></label><label style={{ ...label, display: "flex", alignItems: "center", gap: 5 }}>CH2 position <input aria-label="CH2 vertical position" type="range" min="-1" max="6" step="0.1" value={ch2Position} onChange={(event) => setCh2Position(Number(event.target.value))} /><span>{ch2Position.toFixed(1)} V</span></label></div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(270px,1fr))", gap: 10 }}>
          <WavePanel title="Message reference" color="#a78bfa" values={shown("message")} times={shownTimes} unit="V" description={`${settings.messageHz} Hz reference`} />
          <WavePanel title="AM input · CH1 node" color="#38bdf8" values={shown("am")} times={shownTimes} unit="V" description={`${settings.carrierHz} Hz carrier`} />
          <WavePanel title="Diode rectification" color="#fbbf24" values={shown("rectified")} times={shownTimes} unit="V" description={`D1 · ${settings.diodeDrop.toFixed(2)} V drop`} />
          <WavePanel title="Recovered output · CH2 node" color="#34d399" values={shownSamples.map((sample) => sample.output - outputMean)} times={shownTimes} unit="V" description="Detector node, AC-coupled for display" />
        </div>
      </div>

      <div style={{ ...card, padding: 16 }}>
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div><strong style={{ fontSize: 15 }}>CRO / digital oscilloscope</strong><p style={{ margin: "3px 0 0", color: "#64748b", fontSize: 11 }}>CH1 probes the generator output; CH2 probes the detector output. Both use calculated circuit samples.</p></div>
          <div style={{ display: "flex", gap: 10, fontSize: 11, fontWeight: 700 }}><label><input type="checkbox" checked={ch1Enabled} onChange={(e) => setCh1Enabled(e.target.checked)} /> <span style={{ color: "#0284c7" }}>CH1</span></label><label><input type="checkbox" checked={ch2Enabled} onChange={(e) => setCh2Enabled(e.target.checked)} /> <span style={{ color: "#059669" }}>CH2</span></label></div>
        </div>
        <div style={{ background: "#081521", borderRadius: 10, padding: 12 }}>
          <svg viewBox="0 0 900 260" role="img" aria-label="Oscilloscope showing AM input and detector output" style={{ display: "block", width: "100%", height: "auto" }}>
            {Array.from({ length: 11 }, (_, i) => <line key={`x${i}`} x1={i * 90} x2={i * 90} y1="0" y2="260" stroke="#1e3444" strokeWidth="1" />)}
            {Array.from({ length: 9 }, (_, i) => <line key={`y${i}`} x1="0" x2="900" y1={i * 32.5} y2={i * 32.5} stroke="#1e3444" strokeWidth="1" />)}
            {ch1Enabled && <path d={scopePath(shownScopeCh1, 900, 118, voltsDiv, ch1Position)} transform="translate(0 4)" fill="none" stroke="#38bdf8" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
            {ch2Enabled && <path d={scopePath(shownScopeCh2, 900, 118, voltsDiv, ch2Position)} transform="translate(0 132)" fill="none" stroke="#34d399" strokeWidth="2" vectorEffect="non-scaling-stroke" />}
            <text x="12" y="18" fill="#38bdf8" fontSize="12">CH1 · {voltsDiv} V/div</text><text x="12" y="148" fill="#34d399" fontSize="12">CH2 · {voltsDiv} V/div</text>
          </svg>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(135px,1fr))", gap: 8, marginTop: 10 }}>
          {[
            { name: "CH1 RMS", value: ch1Stats.rms, color: "#0284c7", unit: "V" },
            { name: "CH1 Peak-to-peak", value: ch1Stats.peakToPeak, color: "#0284c7", unit: "V" },
            { name: "CH1 Frequency", value: ch1Stats.frequency ?? 0, color: "#0284c7", unit: "Hz" },
            { name: "CH1 Maximum", value: ch1Stats.max, color: "#0284c7", unit: "V" },
            { name: "CH1 Minimum", value: ch1Stats.min, color: "#0284c7", unit: "V" },
            { name: "CH2 RMS", value: ch2Stats.rms, color: "#059669", unit: "V" },
            { name: "CH2 Peak-to-peak", value: ch2Stats.peakToPeak, color: "#059669", unit: "V" },
            { name: "CH2 Frequency", value: ch2Stats.frequency ?? 0, color: "#059669", unit: "Hz" },
            { name: "CH2 Maximum", value: ch2Stats.max, color: "#059669", unit: "V" },
            { name: "CH2 Minimum", value: ch2Stats.min, color: "#059669", unit: "V" },
          ].map((item) => <div key={item.name} style={{ border: "1px solid #e2e8f0", background: "#f8fafc", borderRadius: 8, padding: 9 }}><span style={{ display: "block", color: "#64748b", fontSize: 10 }}>{item.name}</span><b style={{ color: item.color, fontSize: 13 }}>{item.unit === "Hz" ? `${item.value.toFixed(0)} Hz` : `${item.value.toFixed(3)} V`}</b></div>)}
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>{actionButton("Capture reading", capture, "#047857")}{actionButton("Clear readings", () => setReadings([]), "#475569", readings.length === 0)}</div>
        {readings.length > 0 && <div style={{ overflowX: "auto", marginTop: 10 }}><table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}><thead><tr>{["#", "Time", "CH1 RMS", "CH1 Vpp", "CH2 RMS", "CH2 Vpp"].map((item) => <th key={item} style={{ borderBottom: "1px solid #cbd5e1", textAlign: "left", padding: 7, color: "#475569" }}>{item}</th>)}</tr></thead><tbody>{readings.map((reading, i) => <tr key={reading.id}>{[i + 1, `${reading.time.toFixed(1)} s`, `${reading.ch1.rms.toFixed(3)} V`, `${reading.ch1.peakToPeak.toFixed(3)} V`, `${reading.ch2.rms.toFixed(3)} V`, `${reading.ch2.peakToPeak.toFixed(3)} V`].map((item, j) => <td key={j} style={{ borderBottom: "1px solid #edf2f7", padding: 7 }}>{item}</td>)}</tr>)}</tbody></table></div>}
      </div>
      <style>{`@media(max-width:900px){.am-main-grid{grid-template-columns:minmax(0,1fr)!important}}`}</style>
    </section>
  );
}
