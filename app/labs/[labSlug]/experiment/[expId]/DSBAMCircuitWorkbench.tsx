"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type PartKind = "message" | "carrier" | "balanced" | "capacitor" | "resistor" | "ground" | "scope" | "adder";
type Part = {
  id: string; kind: PartKind; label: string; x: number; y: number; value: string;
  frequencyHz?: number; amplitudeV?: number; modulationIndex?: number; componentValue?: number;
};
type Wire = { id: string; from: string; to: string };
type Reading = { id: number; time: string; messageHz: number; carrierHz: number; modulation: number; vpp: number };
type TerminalSpec = { id: string; label: string; side: "left" | "right" | "top" | "bottom"; offset: number };

const CARD_W = 160;
const CARD_H = 124;
const CANVAS_W = 1320;
const CANVAS_H = 620;
const STORE = "edulabx:dsb-am-workbench:v2";

const PARTS: { kind: PartKind; label: string; short: string; value: string }[] = [
  { kind: "message", label: "Message signal generator", short: "MSG", value: "500 Hz · 1 V" },
  { kind: "carrier", label: "Carrier signal generator", short: "CARR", value: "100 kHz · 2 V" },
  { kind: "balanced", label: "Balanced modulator", short: "BM", value: "DSB-SC" },
  { kind: "adder", label: "AM summing network", short: "Σ", value: "Carrier reinsertion" },
  { kind: "capacitor", label: "Coupling capacitor", short: "C", value: "1 µF" },
  { kind: "resistor", label: "Load resistor", short: "R", value: "10 kΩ" },
  { kind: "ground", label: "Ground", short: "GND", value: "0 V" },
  { kind: "scope", label: "CRO / DSO", short: "CRO", value: "CH1 / CH2" },
];

const INITIAL: Part[] = [
  { id: "msg", kind: "message", label: "Message fm", x: 55, y: 150, value: "500 Hz · 1 V", frequencyHz: 500, amplitudeV: 1 },
  { id: "car", kind: "carrier", label: "Carrier fc", x: 55, y: 365, value: "100 kHz · 2 V", frequencyHz: 100000, amplitudeV: 1 },
  { id: "bm", kind: "balanced", label: "Balanced modulator", x: 480, y: 245, value: "DSB-SC", modulationIndex: 0.5 },
  { id: "sum", kind: "adder", label: "AM summing network", x: 700, y: 245, value: "Carrier reinsertion" },
  { id: "c1", kind: "capacitor", label: "C1 · input coupling", x: 280, y: 150, value: "1 µF", componentValue: 1 },
  { id: "rl", kind: "resistor", label: "RL", x: 1000, y: 390, value: "10 kΩ", componentValue: 10 },
  { id: "gnd", kind: "ground", label: "Ground", x: 1000, y: 520, value: "0 V" },
  { id: "cro", kind: "scope", label: "CRO / DSO", x: 1100, y: 245, value: "CH1 / CH2" },
];

const endpoint = (partId: string, terminalId: string) => `${partId}:${terminalId}`;
const INITIAL_WIRES: Wire[] = [
  { id: "w1", from: endpoint("msg", "out"), to: endpoint("c1", "a") },
  { id: "w2", from: endpoint("c1", "b"), to: endpoint("bm", "message") },
  { id: "w3", from: endpoint("car", "out"), to: endpoint("bm", "carrier") },
  { id: "w4", from: endpoint("bm", "out"), to: endpoint("sum", "dsb") },
  { id: "w5", from: endpoint("car", "out"), to: endpoint("sum", "carrier") },
  { id: "w6", from: endpoint("sum", "out"), to: endpoint("cro", "ch1") },
  { id: "w7", from: endpoint("sum", "out"), to: endpoint("rl", "a") },
  { id: "w8", from: endpoint("rl", "b"), to: endpoint("gnd", "gnd") },
];

function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)); }
function terminalSpecs(kind: PartKind): TerminalSpec[] {
  switch (kind) {
    case "message": case "carrier": return [
      { id: "out", label: "OUT", side: "right", offset: 43 },
      { id: "gnd", label: "GND", side: "right", offset: 88 },
    ];
    case "balanced": return [
      { id: "message", label: "MSG", side: "left", offset: 34 },
      { id: "carrier", label: "CARR", side: "left", offset: 88 },
      { id: "out", label: "OUT", side: "right", offset: 61 },
      { id: "gnd", label: "GND", side: "bottom", offset: 80 },
    ];
    case "adder": return [
      { id: "dsb", label: "DSB-SC", side: "left", offset: 34 },
      { id: "carrier", label: "CARR", side: "left", offset: 88 },
      { id: "out", label: "AM OUT", side: "right", offset: 61 },
      { id: "gnd", label: "GND", side: "bottom", offset: 80 },
    ];
    case "capacitor": case "resistor": return [
      { id: "a", label: "1", side: "left", offset: 62 },
      { id: "b", label: "2", side: "right", offset: 62 },
    ];
    case "ground": return [{ id: "gnd", label: "GND", side: "top", offset: 80 }];
    case "scope": return [
      { id: "ch1", label: "CH1", side: "left", offset: 34 },
      { id: "ch2", label: "CH2", side: "left", offset: 62 },
      { id: "gnd", label: "GND", side: "left", offset: 90 },
    ];
  }
}
function terminalPosition(part: Part, terminalId: string) {
  const spec = terminalSpecs(part.kind).find((t) => t.id === terminalId);
  if (!spec) return { x: part.x + CARD_W / 2, y: part.y + CARD_H / 2 };
  if (spec.side === "left") return { x: part.x, y: part.y + spec.offset };
  if (spec.side === "right") return { x: part.x + CARD_W, y: part.y + spec.offset };
  if (spec.side === "top") return { x: part.x + spec.offset, y: part.y };
  return { x: part.x + spec.offset, y: part.y + CARD_H };
}
function splitEndpoint(value: string) {
  const index = value.lastIndexOf(":");
  return index < 0 ? { partId: value, terminalId: "out" } : { partId: value.slice(0, index), terminalId: value.slice(index + 1) };
}

function PartGlyph({ kind }: { kind: PartKind }) {
  const stroke = "#1679a2";
  if (kind === "message" || kind === "carrier") return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><path d="M3 21 H20 M80 21 H97" stroke={stroke} strokeWidth="2" fill="none"/><circle cx="50" cy="21" r="17" fill="#f0f9ff" stroke={stroke} strokeWidth="2.2"/><path d="M34 21 C39 7 44 7 50 21 S61 35 66 21" stroke={stroke} strokeWidth="2.2" fill="none"/></svg>;
  if (kind === "balanced") return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><rect x="19" y="4" width="62" height="34" rx="4" fill="#effaff" stroke={stroke} strokeWidth="2"/><path d="M30 11 L43 21 L30 31 M70 11 L57 21 L70 31 M43 21 H57 M50 7 V35" stroke={stroke} strokeWidth="2" fill="none"/><circle cx="50" cy="21" r="3" fill={stroke}/></svg>;
  if (kind === "adder") return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><circle cx="50" cy="21" r="17" fill="#effaff" stroke={stroke} strokeWidth="2"/><path d="M50 11 V31 M40 21 H60" stroke={stroke} strokeWidth="2.2"/></svg>;
  if (kind === "capacitor") return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><path d="M3 21 H42 M42 5 V37 M58 5 V37 M58 21 H97" stroke={stroke} strokeWidth="3" fill="none"/></svg>;
  if (kind === "resistor") return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><path d="M3 21 H15 L24 9 L36 33 L48 9 L60 33 L72 9 L83 21 H97" stroke={stroke} strokeWidth="2.4" fill="none" strokeLinejoin="round"/></svg>;
  if (kind === "ground") return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><path d="M50 2 V17 M25 17 H75 M32 25 H68 M40 33 H60" stroke={stroke} strokeWidth="2.4" fill="none"/></svg>;
  return <svg viewBox="0 0 100 42" className="mx-auto h-9 w-24" aria-hidden="true"><rect x="13" y="3" width="74" height="36" rx="5" fill="#102536" stroke={stroke} strokeWidth="2"/><path d="M19 22 C27 6 35 6 43 22 S59 38 67 22 S79 6 82 22" fill="none" stroke="#36d5e9" strokeWidth="2.2"/></svg>;
}

function Trace({ mode, fm, fc, mu, amplitude, running }: { mode: "AM" | "DSB-SC" | "message" | "carrier"; fm: number; fc: number; mu: number; amplitude: number; running: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    if (!running) return;
    let frame = 0; let last = 0;
    const animate = (now: number) => {
      if (now - last > 32) { setPhase((value) => (value + 0.16) % (Math.PI * 2)); last = now; }
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [running]);
  const points = useMemo(() => {
    const n = 1000;
    const carrierCycles = clamp(Math.round((fc / Math.max(fm, 1)) * 4), 20, 100);
    return Array.from({ length: n }, (_, i) => {
      const x = i / (n - 1);
      const message = Math.sin(2 * Math.PI * 4 * x);
      const carrier = Math.cos(2 * Math.PI * carrierCycles * x - phase);
      const y = mode === "message" ? message * amplitude * 0.78 : mode === "carrier" ? carrier * amplitude * 0.78 : mode === "DSB-SC" ? amplitude * mu * message * carrier : amplitude * (1 + mu * message) * carrier;
      return `${i ? "L" : "M"}${(x * 900).toFixed(1)},${(105 - y / (amplitude * 2.2) * 180).toFixed(1)}`;
    }).join(" ");
  }, [mode, fm, fc, mu, amplitude, phase]);
  return <svg viewBox="0 0 900 210" className="block w-full rounded-lg bg-[#0b1721]" role="img" aria-label={`${mode} waveform`}>
    {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 90} x2={i * 90} y1="0" y2="210" stroke="#263b4b"/>)}
    {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" x2="900" y1={i * 52.5} y2={i * 52.5} stroke="#263b4b"/>)}
    <path d={points} fill="none" stroke={mode === "carrier" ? "#fbbf24" : mode === "message" ? "#a78bfa" : "#22d3ee"} strokeWidth="2.2" strokeLinejoin="round"/>
    <text x="12" y="18" fill="#cbd5e1" fontSize="12">{running ? "RUNNING · LIVE SWEEP" : "STOPPED · HOLD TRACE"}</text>
    <text x="888" y="198" fill="#64748b" fontSize="10" textAnchor="end">Educational model · carrier cycles compressed for visibility</text>
  </svg>;
}

export default function DSBAMCircuitWorkbench() {
  const [parts, setParts] = useState<Part[]>(INITIAL);
  const [wires, setWires] = useState<Wire[]>(INITIAL_WIRES);
  const [selected, setSelected] = useState("bm");
  const [pending, setPending] = useState<string | null>(null);
  const [wireMode, setWireMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [panning, setPanning] = useState<{ pointerId: number; startX: number; startY: number; originX: number; originY: number } | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState("Preset DSB-AM topology loaded · educational model ready");
  const [fm, setFm] = useState(500);
  const [fc, setFc] = useState(100000);
  const [mu, setMu] = useState(0.5);
  const [amplitude, setAmplitude] = useState(1);
  const [messageAmplitude, setMessageAmplitude] = useState(1);
  const [mode, setMode] = useState<"AM" | "DSB-SC">("AM");
  const [scopeMode, setScopeMode] = useState<"AM" | "DSB-SC" | "message" | "carrier">("AM");
  const [readings, setReadings] = useState<Reading[]>([]);
  const [history, setHistory] = useState<{ parts: Part[]; wires: Wire[] }[]>([]);
  const [future, setFuture] = useState<{ parts: Part[]; wires: Wire[] }[]>([]);
  const [designName, setDesignName] = useState("DSB-AM Generation");
  const [savedDesigns, setSavedDesigns] = useState<string[]>([]);
  const [dragging, setDragging] = useState<{ id: string; dx: number; dy: number } | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const active = parts.find((p) => p.id === selected) ?? null;
  const selectedMeta = active ? PARTS.find((p) => p.kind === active.kind) : null;
  const isLinked = (a: string, b: string) => wires.some((w) => (w.from === a && w.to === b) || (w.from === b && w.to === a));
  const couplingCap = parts.find((p) => p.kind === "capacitor");
  const loadResistor = parts.find((p) => p.kind === "resistor");
  const groundPart = parts.find((p) => p.kind === "ground");
  const messagePart = parts.find((p) => p.kind === "message");
  const balancedPart = parts.find((p) => p.kind === "balanced");
  const sumPart = parts.find((p) => p.kind === "adder");
  const rcPathConnected = Boolean(couplingCap && loadResistor && groundPart && messagePart && balancedPart && sumPart
    && isLinked(endpoint(messagePart.id, "out"), endpoint(couplingCap.id, "a"))
    && isLinked(endpoint(couplingCap.id, "b"), endpoint(balancedPart.id, "message"))
    && isLinked(endpoint(sumPart.id, "out"), endpoint(loadResistor.id, "a"))
    && isLinked(endpoint(loadResistor.id, "b"), endpoint(groundPart.id, "gnd")));
  const rcTauSeconds = couplingCap && loadResistor ? (loadResistor.componentValue ?? 10) * 1000 * (couplingCap.componentValue ?? 1) * 1e-6 : 0;
  const rcCutoffHz = rcTauSeconds > 0 ? 1 / (2 * Math.PI * rcTauSeconds) : 0;
  const rcGain = rcPathConnected && rcCutoffHz > 0 ? fm / Math.sqrt(fm * fm + rcCutoffHz * rcCutoffHz) : 1;
  const effectiveMu = mu * messageAmplitude * rcGain;

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORE);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.savedDesigns)) setSavedDesigns(parsed.savedDesigns);
      if (Array.isArray(parsed.parts) && Array.isArray(parsed.wires)) {
        setParts(parsed.parts); setWires(parsed.wires);
        if (typeof parsed.designName === "string") setDesignName(parsed.designName);
      }
    } catch { /* Start with the built-in preset if saved data is invalid. */ }
  }, []);

  const remember = () => { setHistory((h) => [...h.slice(-29), { parts, wires }]); setFuture([]); };
  const updatePart = (id: string, patch: Partial<Part>) => {
    remember();
    setParts((items) => items.map((p) => p.id === id ? { ...p, ...patch } : p));
    // Property edits are live: keep the CRO sweep running while values change.
  };
  const updateNumeric = (field: "frequencyHz" | "amplitudeV" | "modulationIndex" | "componentValue", value: number) => {
    if (!active) return;
    let displayValue = active.value;
    if (field === "frequencyHz" && active.kind === "message") displayValue = `${value} Hz · ${active.amplitudeV ?? 1} V`;
    if (field === "frequencyHz" && active.kind === "carrier") displayValue = `${value >= 1000 ? `${value / 1000} kHz` : `${value} Hz`} · ${active.amplitudeV ?? 1} V`;
    if (field === "amplitudeV" && active.kind === "message") displayValue = `${active.frequencyHz ?? fm} Hz · ${value} V`;
    if (field === "amplitudeV" && active.kind === "carrier") displayValue = `${(active.frequencyHz ?? fc) / 1000} kHz · ${value} V`;
    if (field === "modulationIndex") displayValue = `DSB-SC · μ = ${value.toFixed(2)}`;
    if (field === "componentValue" && active.kind === "capacitor") displayValue = `${value} µF`;
    if (field === "componentValue" && active.kind === "resistor") displayValue = `${value} kΩ`;
    updatePart(active.id, { [field]: value, value: displayValue });
    if (active.kind === "message" && field === "frequencyHz") setFm(value);
    if (active.kind === "carrier" && field === "frequencyHz") setFc(value);
    if (active.kind === "carrier" && field === "amplitudeV") setAmplitude(value);
    if (active.kind === "balanced" && field === "modulationIndex") setMu(value);
    if (active.kind === "message" && field === "amplitudeV") setMessageAmplitude(value);
  };
  const addPartAt = (kind: PartKind, x?: number, y?: number) => {
    const meta = PARTS.find((p) => p.kind === kind)!; remember();
    const id = `${kind}-${Date.now()}`;
    const item: Part = { id, kind, label: meta.label, x: clamp(x ?? 380 + (parts.length % 3) * 100, 12, CANVAS_W - CARD_W - 12), y: clamp(y ?? 70 + (parts.length % 4) * 85, 12, CANVAS_H - CARD_H - 12), value: meta.value };
    if (kind === "message") { item.frequencyHz = 500; item.amplitudeV = 1; }
    if (kind === "carrier") { item.frequencyHz = 100000; item.amplitudeV = 1; }
    if (kind === "balanced") item.modulationIndex = 0.5;
    if (kind === "capacitor") item.componentValue = 1;
    if (kind === "resistor") item.componentValue = 10;
    setParts((items) => [...items, item]); setSelected(id); setStatus(`${meta.label} added. Connect its terminals to the circuit.`);
  };
  const addPart = (kind: PartKind) => addPartAt(kind);
  const newBlank = () => { remember(); setParts([]); setWires([]); setSelected(""); setPending(null); setWireMode(false); setRunning(false); setReadings([]); setDesignName("Untitled DSB-AM circuit"); setStatus("Blank sandbox ready · drag components from the library and wire terminal-to-terminal"); };
  const loadPreset = () => { remember(); setParts(INITIAL); setWires(INITIAL_WIRES); setSelected("bm"); setPending(null); setWireMode(false); setRunning(false); setStatus("Preset DSB-AM topology restored"); };
  const removeSelected = () => {
    if (!selected) return;
    remember(); setParts((items) => items.filter((p) => p.id !== selected));
    setWires((items) => items.filter((w) => splitEndpoint(w.from).partId !== selected && splitEndpoint(w.to).partId !== selected));
    setSelected(""); setRunning(false);
  };
  const connectTerminal = (terminal: string) => {
    if (!pending) { setPending(terminal); setStatus("First terminal selected · now choose the destination terminal"); return; }
    if (pending !== terminal) {
      const duplicate = wires.some((w) => (w.from === pending && w.to === terminal) || (w.from === terminal && w.to === pending));
      if (!duplicate) { remember(); setWires((items) => [...items, { id: `wire-${Date.now()}`, from: pending, to: terminal }]); setStatus("Wire connected between selected terminals"); }
    }
    setPending(null); setWireMode(false);
  };
  const undo = () => { const previous = history[history.length - 1]; if (!previous) return; setFuture((f) => [...f, { parts, wires }]); setParts(previous.parts); setWires(previous.wires); setHistory((h) => h.slice(0, -1)); setRunning(false); };
  const redo = () => { const next = future[future.length - 1]; if (!next) return; setHistory((h) => [...h, { parts, wires }]); setParts(next.parts); setWires(next.wires); setFuture((f) => f.slice(0, -1)); setRunning(false); };
  const save = () => {
    const next = [...savedDesigns.filter((s) => s !== designName), designName];
    const all = JSON.parse(localStorage.getItem(STORE) || "{}");
    const designs = { ...(all.designs || {}), [designName]: { parts, wires, name: designName } };
    localStorage.setItem(STORE, JSON.stringify({ parts, wires, designName, savedDesigns: next, designs }));
    setSavedDesigns(next); setStatus(`Saved “${designName}” in this browser`);
  };
  const openSaved = (name: string) => {
    if (!name) return;
    try { const data = JSON.parse(localStorage.getItem(STORE) || "{}"); const design = data.designs?.[name]; if (design && Array.isArray(design.parts) && Array.isArray(design.wires)) { remember(); setParts(design.parts); setWires(design.wires); setDesignName(name); setSelected(""); setRunning(false); setStatus(`Opened “${name}”`); } } catch { setStatus("Could not open this saved design"); }
  };
  const exportDesign = () => { const blob = new Blob([JSON.stringify({ name: designName, parts, wires }, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = `${designName.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "dsb-am"}.json`; a.click(); URL.revokeObjectURL(url); };
  const importDesign = (file?: File) => { if (!file) return; const reader = new FileReader(); reader.onload = () => { try { const data = JSON.parse(String(reader.result)); if (Array.isArray(data.parts) && Array.isArray(data.wires)) { remember(); setParts(data.parts); setWires(data.wires); setDesignName(data.name || "Imported DSB-AM"); setSelected(""); setRunning(false); setStatus("Circuit design imported"); } else throw new Error("Invalid format"); } catch { alert("This design file is not valid."); } }; reader.readAsText(file); };
  const capture = () => setReadings((r) => [...r, { id: Date.now(), time: new Date().toLocaleTimeString(), messageHz: fm, carrierHz: fc, modulation: effectiveMu, vpp: mode === "AM" ? 2 * amplitude * (1 + effectiveMu) : 2 * amplitude * effectiveMu }]);

  const fitToScreen = () => {
    const viewport = canvasRef.current;
    if (!viewport) { setZoom(1); setPan({ x: 0, y: 0 }); return; }
    const availableWidth = Math.max(320, viewport.clientWidth - 24);
    const availableHeight = Math.max(260, viewport.clientHeight - 24);
    const nextZoom = clamp(Math.min(availableWidth / CANVAS_W, availableHeight / CANVAS_H), 0.5, 1.6);
    setZoom(nextZoom);
    setPan({ x: 0, y: 0 });
  };
  const resetView = () => { setZoom(1); setPan({ x: 0, y: 0 }); };
  const partById = (id: string) => parts.find((p) => p.id === id);
  const wireCoords = (wire: Wire) => {
    const from = splitEndpoint(wire.from); const to = splitEndpoint(wire.to);
    const a = partById(from.partId); const b = partById(to.partId);
    if (!a || !b) return null;
    return { p1: terminalPosition(a, from.terminalId), p2: terminalPosition(b, to.terminalId) };
  };
  const validateCircuit = () => {
    const has = (a: string, b: string) => wires.some((w) => (w.from === a && w.to === b) || (w.from === b && w.to === a));
    const message = parts.find((p) => p.kind === "message"); const carrier = parts.find((p) => p.kind === "carrier");
    const balanced = parts.find((p) => p.kind === "balanced"); const adder = parts.find((p) => p.kind === "adder"); const scope = parts.find((p) => p.kind === "scope");
    const capacitor = parts.find((p) => p.kind === "capacitor");
    const resistor = parts.find((p) => p.kind === "resistor");
    const ground = parts.find((p) => p.kind === "ground");
    if (!message || !carrier || !balanced || !adder || !scope || !capacitor || !resistor || !ground) return "Add message and carrier generators, coupling capacitor, balanced modulator, AM summing network, load resistor, ground and CRO/DSO.";
    const required = [
      [endpoint(message.id, "out"), endpoint(parts.find((p) => p.kind === "capacitor")?.id ?? balanced.id, parts.some((p) => p.kind === "capacitor") ? "a" : "message")],
      [endpoint(parts.find((p) => p.kind === "capacitor")?.id ?? message.id, parts.some((p) => p.kind === "capacitor") ? "b" : "out"), endpoint(balanced.id, "message")],
      [endpoint(carrier.id, "out"), endpoint(balanced.id, "carrier")],
      [endpoint(balanced.id, "out"), endpoint(adder.id, "dsb")],
      [endpoint(carrier.id, "out"), endpoint(adder.id, "carrier")],
      [endpoint(adder.id, "out"), endpoint(scope.id, "ch1")],
      [endpoint(adder.id, "out"), endpoint(resistor.id, "a")],
      [endpoint(resistor.id, "b"), endpoint(ground.id, "gnd")],
    ];
    if (!required.every(([a, b]) => has(a, b))) return "Circuit incomplete: connect MSG→BM, CARR→BM, BM→Σ, CARR→Σ and Σ→CRO using the terminal pins.";
    return "";
  };
  const run = () => { const error = validateCircuit(); if (error) { setRunning(false); setStatus(error); return; } setRunning(true); setStatus("Circuit connections validated · DSB-AM educational model running"); };

  const startDrag = (event: React.PointerEvent, part: Part) => {
    if ((event.target as HTMLElement).closest("button")) return;
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return;
    setSelected(part.id); setDragging({ id: part.id, dx: event.clientX - rect.left - pan.x - part.x * zoom, dy: event.clientY - rect.top - pan.y - part.y * zoom });
    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
  };
  const moveDrag = (event: React.PointerEvent) => {
    if (panning && event.pointerId === panning.pointerId) {
      setPan({
        x: panning.originX + event.clientX - panning.startX,
        y: panning.originY + event.clientY - panning.startY,
      });
      return;
    }
    if (!dragging) return;
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return;
    setParts((items) => items.map((p) => p.id === dragging.id ? { ...p, x: clamp((event.clientX - rect.left - pan.x - dragging.dx) / zoom, 12, CANVAS_W - CARD_W - 12), y: clamp((event.clientY - rect.top - pan.y - dragging.dy) / zoom, 12, CANVAS_H - CARD_H - 12) } : p));
  };
  const startPan = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-circuit-part], button, input, select, label")) return;
    if (event.button !== 0 && event.button !== 1) return;
    event.preventDefault();
    setPanning({ pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, originX: pan.x, originY: pan.y });
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const endDrag = (event?: React.PointerEvent) => {
    if (panning && (!event || event.pointerId === panning.pointerId)) setPanning(null);
    if (dragging) { setDragging(null); setHistory((h) => [...h.slice(-29), { parts, wires }]); setFuture([]); }
  };
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault(); const kind = event.dataTransfer.getData("application/edulabx-part") as PartKind;
    if (!PARTS.some((p) => p.kind === kind)) return;
    const rect = canvasRef.current?.getBoundingClientRect(); if (!rect) return;
    addPartAt(kind, (event.clientX - rect.left - pan.x) / zoom - CARD_W / 2, (event.clientY - rect.top - pan.y) / zoom - CARD_H / 2);
  };

  return <section className="space-y-5">
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-[.18em] text-cyan-700">Circuit design · EduLabX practical</p><h2 className="text-xl font-bold text-slate-900">DSB-AM generation · circuit design workbench</h2><p className="mt-1 text-xs text-slate-500">Manual circuit construction · terminal wiring · interactive educational signal model</p></div><span className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-900">DSB-AM workspace</span></div>
      <div className="mt-4 flex flex-wrap gap-2 border-y border-slate-100 py-3">
        <button onClick={newBlank} className="rounded-md border border-slate-400 px-3 py-2 text-sm font-semibold">＋ New blank</button>
        <button onClick={loadPreset} className="rounded-md border border-cyan-300 bg-cyan-50 px-3 py-2 text-sm font-semibold text-cyan-900">Circuit preset</button>
        <button onClick={() => setZoom((z) => clamp(z - .1, .5, 1.6))} className="rounded-md border px-3 py-2" aria-label="Zoom out">−</button><span className="self-center text-sm tabular-nums">{Math.round(zoom * 100)}%</span><button onClick={() => setZoom((z) => clamp(z + .1, .5, 1.6))} className="rounded-md border px-3 py-2" aria-label="Zoom in">＋</button>
        <button onClick={fitToScreen} className="rounded-md border px-3 py-2 text-sm">Fit to screen</button>
        <button onClick={resetView} className="rounded-md border px-3 py-2 text-sm">Reset zoom</button>
        <button onClick={undo} disabled={!history.length} className="rounded-md border px-3 py-2 text-sm disabled:opacity-40">↶ Undo</button><button onClick={redo} disabled={!future.length} className="rounded-md border px-3 py-2 text-sm disabled:opacity-40">↷ Redo</button>
        <button onClick={() => { setPending(null); setWireMode((v) => !v); setStatus("Choose a terminal pin, then choose a second terminal pin"); }} className={`rounded-md border px-3 py-2 text-sm ${wireMode ? "border-cyan-600 bg-cyan-100" : ""}`}>＋ Add wire</button>
        <button onClick={removeSelected} disabled={!active} className="rounded-md border px-3 py-2 text-sm text-rose-700 disabled:opacity-40">Delete</button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <input value={designName} onChange={(e) => setDesignName(e.target.value)} aria-label="Design name" className="min-w-40 rounded-md border px-3 py-2 text-sm"/>
        <button onClick={save} className="rounded-md bg-cyan-800 px-3 py-2 text-sm font-bold text-white">Save</button>
        <select aria-label="Open saved design" defaultValue="" onChange={(e) => openSaved(e.target.value)} className="rounded-md border px-3 py-2 text-sm"><option value="">Open design…</option>{savedDesigns.map((name) => <option key={name} value={name}>{name}</option>)}</select>
        <button onClick={exportDesign} className="rounded-md border px-3 py-2 text-sm">Export</button><label className="cursor-pointer rounded-md border px-3 py-2 text-sm">Import<input type="file" accept="application/json" className="hidden" onChange={(e) => importDesign(e.target.files?.[0])}/></label>
      </div>
      <p className="mt-2 text-xs text-slate-600" role="status">{status}</p>
    </div>

    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
      <div className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 className="font-bold text-slate-900">DSB-AM circuit canvas</h3><span className="text-xs text-slate-500">{wireMode ? (pending ? "Select the second terminal pin" : "Select the first terminal pin") : "Drag components · click pins to wire · select a component to edit"}</span></div>
        <div ref={canvasRef} onPointerDown={startPan} onPointerMove={moveDrag} onPointerUp={endDrag} onPointerCancel={endDrag} onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} className={`relative min-h-[540px] overflow-auto rounded-lg border border-dashed border-slate-300 bg-[radial-gradient(#d5e1ea_1px,transparent_1px)] [background-size:18px_18px] ${panning ? "cursor-grabbing" : "cursor-grab"}`} style={{ touchAction: "none" }}>
          <div className="relative" style={{ height: CANVAS_H * zoom, minWidth: CANVAS_W * zoom }}>
            <div className="absolute left-0 top-0" style={{ width: CANVAS_W, height: CANVAS_H, transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`, transformOrigin: "top left" }}>
              <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${CANVAS_W} ${CANVAS_H}`}>
                {wires.map((wire) => { const coords = wireCoords(wire); if (!coords) return null; const { p1, p2 } = coords; const mid = Math.round((p1.x + p2.x) / 2); return <g key={wire.id}><path d={`M${p1.x},${p1.y} H${mid} V${p2.y} H${p2.x}`} fill="none" stroke="#16845b" strokeWidth="3.2" strokeLinejoin="round"/><circle cx={p1.x} cy={p1.y} r="4" fill="#16845b"/><circle cx={p2.x} cy={p2.y} r="4" fill="#16845b"/></g>; })}
              </svg>
              {parts.map((part) => {
                const meta = PARTS.find((p) => p.kind === part.kind)!; const isSelected = selected === part.id;
                return <div key={part.id} data-circuit-part="true" onPointerDown={(e) => startDrag(e, part)} onClick={() => { if (!wireMode) setSelected(part.id); }} className={`absolute flex flex-col items-center justify-center rounded-lg border-2 px-2 py-1 text-center shadow-sm ${isSelected ? "border-cyan-600 bg-cyan-50 ring-2 ring-cyan-100" : "border-slate-400 bg-white"}`} style={{ left: part.x, top: part.y, width: CARD_W, height: CARD_H, touchAction: "none" }}>
                  <span className="text-[9px] font-extrabold uppercase tracking-wider text-cyan-800">{meta.short}</span><PartGlyph kind={part.kind}/><span className="text-[11px] font-bold leading-tight text-slate-800">{part.label}</span><span className="text-[9px] text-slate-500">{part.value}</span>
                  {terminalSpecs(part.kind).map((terminal) => {
                    const style: React.CSSProperties = terminal.side === "left" ? { left: -7, top: terminal.offset - 7 } : terminal.side === "right" ? { right: -7, top: terminal.offset - 7 } : terminal.side === "top" ? { top: -7, left: terminal.offset - 7 } : { bottom: -7, left: terminal.offset - 7 };
                    const id = endpoint(part.id, terminal.id); const isPending = pending === id;
                    return <button key={terminal.id} type="button" title={`${part.label} · ${terminal.label}`} aria-label={`Connect ${part.label} ${terminal.label} terminal`} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => { e.stopPropagation(); setSelected(part.id); if (wireMode) connectTerminal(id); else setStatus(`${part.label} · ${terminal.label} terminal selected. Choose Add wire to connect.`); }} className={`absolute z-10 h-4 w-4 rounded-full border-2 border-white shadow ${isPending ? "bg-amber-500 ring-2 ring-amber-300" : "bg-cyan-700 hover:bg-cyan-500"}`} style={style}><span className="sr-only">{terminal.label}</span></button>;
                  })}
                </div>;
              })}
              {parts.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><div className="rounded-xl border border-dashed border-slate-400 bg-white/90 px-8 py-7 text-center"><p className="text-lg font-bold text-slate-800">Blank circuit sandbox</p><p className="mt-2 max-w-md text-sm text-slate-600">Drag parts from the component library or click a part to add it. Then select Add wire and connect terminal pins.</p></div></div>}
            </div>
          </div>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">Terminal-level educational circuit editor. Component placement and pin-to-pin wires are editable. The waveform engine is a DSB-AM mathematical model, not a transistor-level SPICE solver.</p>
      </div>

      <aside className="space-y-4">
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-900">Component library</h3><p className="mb-3 mt-1 text-xs text-slate-500">Drag a component onto the canvas or click to add.</p><div className="grid grid-cols-2 gap-2">{PARTS.map((part) => <button key={part.kind} draggable onDragStart={(e) => e.dataTransfer.setData("application/edulabx-part", part.kind)} onClick={() => addPart(part.kind)} className="rounded-lg border border-slate-200 p-2 text-left hover:border-cyan-500 hover:bg-cyan-50"><span className="block text-xs font-extrabold text-cyan-800">{part.short}</span><span className="text-[11px] font-semibold text-slate-700">{part.label}</span></button>)}</div></div>
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="font-bold text-slate-900">Component properties</h3>
          {active ? <div className="mt-3 space-y-3">
            <label className="block text-xs font-semibold text-slate-600">Reference / label<input value={active.label} onChange={(e) => updatePart(active.id, { label: e.target.value })} className="mt-1 w-full rounded-md border px-2 py-2 text-sm text-slate-900"/></label>
            {active.kind === "message" && <><label className="block text-xs font-semibold text-slate-600">Message frequency (Hz)<input type="number" min="1" max="20000" value={active.frequencyHz ?? fm} onChange={(e) => updateNumeric("frequencyHz", Math.max(1, Number(e.target.value)))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label><label className="block text-xs font-semibold text-slate-600">Message amplitude (V peak)<input type="number" min="0.01" max="20" step="0.1" value={active.amplitudeV ?? 1} onChange={(e) => updateNumeric("amplitudeV", Math.max(0.01, Number(e.target.value)))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label></>}
            {active.kind === "carrier" && <><label className="block text-xs font-semibold text-slate-600">Carrier frequency (Hz)<input type="number" min="100" max="10000000" value={active.frequencyHz ?? fc} onChange={(e) => updateNumeric("frequencyHz", Math.max(100, Number(e.target.value)))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label><label className="block text-xs font-semibold text-slate-600">Carrier amplitude (V peak)<input type="number" min="0.01" max="20" step="0.1" value={active.amplitudeV ?? amplitude} onChange={(e) => updateNumeric("amplitudeV", Math.max(0.01, Number(e.target.value)))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label></>}
            {active.kind === "balanced" && <label className="block text-xs font-semibold text-slate-600">Modulation index μ<input type="number" min="0" max="1.5" step="0.05" value={active.modulationIndex ?? mu} onChange={(e) => updateNumeric("modulationIndex", clamp(Number(e.target.value), 0, 1.5))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label>}
            {active.kind === "capacitor" && <label className="block text-xs font-semibold text-slate-600">Capacitance (µF)<input type="number" min="0.001" max="1000" step="0.1" value={active.componentValue ?? 1} onChange={(e) => updateNumeric("componentValue", Math.max(0.001, Number(e.target.value)))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label>}
            {active.kind === "resistor" && <label className="block text-xs font-semibold text-slate-600">Resistance (kΩ)<input type="number" min="0.001" max="10000" step="0.1" value={active.componentValue ?? 10} onChange={(e) => updateNumeric("componentValue", Math.max(0.001, Number(e.target.value)))} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label>}
            {!(["message", "carrier", "balanced", "capacitor", "resistor"] as PartKind[]).includes(active.kind) && <label className="block text-xs font-semibold text-slate-600">Value / description<input value={active.value} onChange={(e) => updatePart(active.id, { value: e.target.value })} className="mt-1 w-full rounded-md border px-2 py-2 text-sm"/></label>}
            <p className="text-[11px] text-slate-500">Type: {selectedMeta?.label}. Parameter edits update the displayed signal model and CRO.</p>
          </div> : <p className="mt-2 text-xs text-slate-500">Select a component on the canvas to edit its parameters.</p>}
        </div>
      </aside>
    </div>

    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-700">Simulation controls</p><h3 className="text-lg font-bold text-slate-900">DSB-AM signal model</h3></div><div className="flex gap-2"><button onClick={run} className="rounded-md bg-emerald-700 px-4 py-2 text-sm font-bold text-white">▶ Run</button><button onClick={() => { setRunning(false); setStatus("Simulation stopped · last trace held"); }} className="rounded-md bg-slate-600 px-4 py-2 text-sm font-bold text-white">Ⅱ Stop</button><button onClick={() => { setRunning(false); setReadings([]); setStatus("Simulation readings cleared"); }} className="rounded-md bg-sky-700 px-4 py-2 text-sm font-bold text-white">↻ Reset</button></div></div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">{[{ label: "Message frequency", value: fm, min: 100, max: 2000, step: 50, unit: "Hz", set: setFm, kind: "message" as const, field: "frequencyHz" as const }, { label: "Carrier frequency", value: fc, min: 10000, max: 200000, step: 5000, unit: "Hz", set: setFc, kind: "carrier" as const, field: "frequencyHz" as const }, { label: "Carrier amplitude", value: amplitude, min: .2, max: 3, step: .1, unit: "V peak", set: setAmplitude, kind: "carrier" as const, field: "amplitudeV" as const }, { label: "Modulation index", value: mu, min: 0, max: 1.2, step: .05, unit: "", set: setMu, kind: "balanced" as const, field: "modulationIndex" as const }].map((item) => <label key={item.label} className="rounded-lg border border-slate-200 p-3"><span className="flex justify-between gap-2 text-xs font-bold text-slate-700"><span>{item.label}</span><span className="text-cyan-800">{item.value.toFixed(item.step < 1 ? 2 : 0)} {item.unit}</span></span><input type="range" min={item.min} max={item.max} step={item.step} value={item.value} onChange={(e) => { const value = Number(e.target.value); item.set(value); const part = parts.find((p) => p.kind === item.kind); if (part) setParts((items) => items.map((p) => p.id === part.id ? { ...p, [item.field]: value, value: item.field === "frequencyHz" ? `${value} Hz` : item.field === "amplitudeV" ? `${value} V peak` : `μ = ${value.toFixed(2)}` } : p)); }} className="mt-3 w-full accent-cyan-700"/></label>)}</div>
      <div className="mt-3 flex flex-wrap items-center gap-2"><span className="text-xs font-bold text-slate-600">Output:</span><button onClick={() => setMode("AM")} className={`rounded-md border px-3 py-2 text-xs font-bold ${mode === "AM" ? "border-cyan-700 bg-cyan-50 text-cyan-900" : ""}`}>Conventional AM</button><button onClick={() => setMode("DSB-SC")} className={`rounded-md border px-3 py-2 text-xs font-bold ${mode === "DSB-SC" ? "border-cyan-700 bg-cyan-50 text-cyan-900" : ""}`}>DSB-SC</button><span className="ml-auto text-xs text-slate-500">μ = {mu.toFixed(2)} · {mu > 1 ? "Overmodulated" : "Envelope valid"}</span></div>
    </div>

    <div className="rounded-xl border border-slate-800 bg-[#111e29] p-4 text-white shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><div><p className="text-[10px] font-extrabold uppercase tracking-widest text-cyan-300">Virtual instrument</p><h3 className="text-lg font-bold">CRO / Digital Storage Oscilloscope</h3><p className="text-xs text-slate-400">CH1: {mode} output · moving sweep while Run is active</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${running ? "bg-emerald-900 text-emerald-200" : "bg-slate-700 text-slate-300"}`}>● {running ? "LIVE" : "PAUSED"}</span></div>
      <div className="mb-3 flex flex-wrap gap-2">{(["AM", "DSB-SC", "message", "carrier"] as const).map((v) => <button key={v} onClick={() => setScopeMode(v)} className={`rounded-md px-3 py-2 text-xs font-bold ${scopeMode === v ? "bg-cyan-700 text-white" : "bg-slate-700 text-slate-200"}`}>CH1 · {v}</button>)}</div>
      <Trace mode={scopeMode} fm={fm} fc={fc} mu={effectiveMu} amplitude={amplitude} running={running}/>
      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">{[{ label: "Message frequency", value: `${fm} Hz` }, { label: "Carrier frequency", value: `${fc / 1000} kHz` }, { label: "Effective modulation", value: effectiveMu.toFixed(3) }, { label: "RC cutoff (model)", value: rcPathConnected ? `${rcCutoffHz.toFixed(1)} Hz` : "Not connected" }, { label: "Output Vpp (model)", value: `${(2 * amplitude * (mode === "AM" ? (1 + effectiveMu) : effectiveMu)).toFixed(2)} V` }].map((x) => <div key={x.label} className="rounded-lg bg-[#1a2c3b] p-3"><span className="block text-[10px] text-slate-400">{x.label}</span><b className="text-sm text-cyan-300">{x.value}</b></div>)}</div>
      <div className="mt-3 flex flex-wrap gap-2"><button onClick={capture} className="rounded-md bg-emerald-700 px-3 py-2 text-xs font-bold">Capture reading</button><button onClick={() => setReadings([])} className="rounded-md bg-slate-600 px-3 py-2 text-xs font-bold">Clear readings</button></div>
      {readings.length > 0 && <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="text-slate-400">{["#", "Time", "fm", "fc", "μ", "Vpp"].map((x) => <th key={x} className="p-2">{x}</th>)}</tr></thead><tbody>{readings.map((r, i) => <tr key={r.id} className="border-t border-slate-700"><td className="p-2">{i + 1}</td><td className="p-2">{r.time}</td><td className="p-2">{r.messageHz}</td><td className="p-2">{r.carrierHz}</td><td className="p-2">{r.modulation.toFixed(2)}</td><td className="p-2">{r.vpp.toFixed(2)} V</td></tr>)}</tbody></table></div>}
    </div>
  </section>;
}
