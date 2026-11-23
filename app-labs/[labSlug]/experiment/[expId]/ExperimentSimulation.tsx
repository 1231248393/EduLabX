"use client";

import React, { useEffect, useMemo, useState } from "react";

type Point = number | null;
type Trace = { name: string; color: string; values: Point[] };

function WaveformPlot({ title, traces, min = -1.2, max = 1.2 }: { title: string; traces: Trace[]; min?: number; max?: number }) {
  const width = 760;
  const height = 190;
  const pathFor = (values: Point[]) => {
    let drawing = false;
    return values.map((value, index) => {
      if (value === null || !Number.isFinite(value)) { drawing = false; return ""; }
      const x = (index / Math.max(1, values.length - 1)) * width;
      const y = height - ((value - min) / (max - min)) * height;
      const command = `${drawing ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      drawing = true;
      return command;
    }).join(" ");
  };
  return <section className="rounded-lg border border-slate-700 bg-[#101d28] p-3 text-white">
    <div className="mb-2 flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold">{title}</h3><div className="flex flex-wrap gap-3">{traces.map((trace) => <span key={trace.name} className="inline-flex items-center gap-1.5 text-xs text-slate-200"><i className="h-2 w-2 rounded-full" style={{ backgroundColor: trace.color }} />{trace.name}</span>)}</div></div>
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title} className="block h-auto w-full rounded bg-[#0c1720]">
      {Array.from({ length: 9 }, (_, i) => <line key={`v${i}`} x1={i * width / 8} x2={i * width / 8} y1="0" y2={height} stroke="#263746" strokeWidth="1" />)}
      {Array.from({ length: 5 }, (_, i) => <line key={`h${i}`} x1="0" x2={width} y1={i * height / 4} y2={i * height / 4} stroke="#263746" strokeWidth="1" />)}
      {traces.map((trace) => <path key={trace.name} d={pathFor(trace.values)} fill="none" stroke={trace.color} strokeWidth="2" vectorEffect="non-scaling-stroke" />)}
    </svg>
  </section>;
}

function RangeControl({ label, value, min, max, step, unit, onChange }: { label: string; value: number; min: number; max: number; step: number; unit: string; onChange: (value: number) => void }) {
  return <label className="block rounded-lg border border-slate-200 bg-white p-3">
    <span className="mb-2 flex items-center justify-between gap-3 text-sm font-semibold text-slate-700"><span>{label}</span><span className="tabular-nums text-[#087da0]">{value.toFixed(step < 1 ? 2 : 0)} {unit}</span></span>
    <input aria-label={label} className="w-full accent-[#087da0]" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} />
  </label>;
}

function ModelFlow({ items }: { items: string[] }) {
  return <div className="mb-4 flex flex-wrap items-center justify-center gap-2 rounded-lg border border-sky-200 bg-sky-50 p-4">
    {items.map((item, index) => <React.Fragment key={item}><span className="rounded-md border border-sky-200 bg-white px-3 py-2 text-center text-xs font-semibold text-slate-700">{item}</span>{index < items.length - 1 && <span className="font-bold text-sky-700" aria-hidden="true">→</span>}</React.Fragment>)}
  </div>;
}

function DetectorTopology({ mode }: { mode: "Foster-Seeley discriminator" | "Ratio detector" }) {
  const ratio = mode === "Ratio detector";
  return <div className="rounded-lg border border-slate-200 bg-white p-3">
    <p className="mb-2 text-xs font-semibold text-slate-600">Model topology: {mode}</p>
    <svg viewBox="0 0 680 220" role="img" aria-label={`${mode} educational topology diagram`} className="w-full">
      <g stroke="#256e91" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M25 105H90M90 55V155M90 55H140M90 155H140M140 55V155M140 105H205M205 55V155M205 55H255M205 155H255M255 55V155M255 105H330M330 105H380" />
        <path d={ratio ? "M380 105H455V65M455 105V145M455 65H530M455 145H530M530 65V145M530 105H640" : "M380 105V55M380 105V155M380 55H445M380 155H445M445 55V155M445 105H525V70M525 105V140M525 70H640M525 140H640"} />
        <path d={ratio ? "M380 105V185H570V145M455 145V185" : "M205 155V190H590V140M380 155V190"} />
      </g>
      <g fill="#fff" stroke="#394b59" strokeWidth="2">
        <rect x="117" y="43" width="46" height="24" rx="4" /><rect x="117" y="143" width="46" height="24" rx="4" />
        <rect x="418" y={ratio ? 53 : 58} width="52" height="24" rx="12" /><rect x="418" y={ratio ? 133 : 128} width="52" height="24" rx="12" />
        {ratio && <rect x="555" y="74" width="18" height="62" rx="8" />}
      </g>
      <g fill="#102638" fontSize="13" fontWeight="600">
        <text x="18" y="92">FM input</text><text x="93" y="35">Tuned</text><text x="93" y="49">transformer</text>
        <text x="419" y={ratio ? 49 : 54}>D1</text><text x="419" y={ratio ? 171 : 173}>D2</text>
        <text x="536" y="39">Audio output</text><text x="533" y="58">RL</text>
        {ratio && <text x="550" y="157">C reservoir</text>}
        {!ratio && <text x="275" y="205">Centre tap / balanced discriminator arms</text>}
        {ratio && <text x="270" y="205">Series diode arms with reservoir capacitor</text>}
      </g>
    </svg>
  </div>;
}


function ExperimentCircuitSchematic({ experiment, detectorMode }: { experiment: string; detectorMode: "Foster-Seeley discriminator" | "Ratio detector" }) {
  const part = { fill: "#fff", stroke: "#38566a", strokeWidth: 2 };
  const label = { fill: "#18364a", fontSize: 13, fontWeight: 700 };
  const node = (x: number, y: number) => <circle cx={x} cy={y} r="4" fill="#16845f" stroke="white" strokeWidth="1.5" />;
  const resistor = (x: number, y: number, name: string) => <g><path d={`M${x} ${y}h12l6 -9 12 18 12 -18 12 18 12 -18 8 9h12`} {...{ stroke: "#38566a", strokeWidth: 2.5, fill: "none" }} /><text x={x+43} y={y-15} textAnchor="middle" {...{ fill: "#18364a", fontSize: 12, fontWeight: 700 }}>{name}</text></g>;
  const capacitor = (x: number, y: number, name: string) => <g><path d={`M${x} ${y-22}v16m-14 0h28m-28 9h28m-14 0v20`} stroke="#38566a" strokeWidth="2.5" fill="none"/><text x={x+20} y={y+2} {...{fill:"#18364a",fontSize:12,fontWeight:700}}>{name}</text></g>;
  const diode = (x: number, y: number, name: string) => <g><path d={`M${x-18} ${y}h8m0 -14l25 14 -25 14z m25 -14v28m0 -14h18`} stroke="#38566a" strokeWidth="2.5" fill="#fff"/><text x={x+2} y={y-22} textAnchor="middle" {...{fill:"#18364a",fontSize:12,fontWeight:700}}>{name}</text></g>;
  const source = (x: number, y: number, name: string) => <g><circle cx={x} cy={y} r="23" fill="#effaff" stroke="#147da0" strokeWidth="2.5"/><path d={`M${x-14} ${y}q7 -14 14 0t14 0`} stroke="#147da0" strokeWidth="2" fill="none"/><text x={x} y={y+39} textAnchor="middle" {...{fill:"#18364a",fontSize:12,fontWeight:700}}>{name}</text></g>;
  const scope = (x: number, y: number) => <g><rect x={x} y={y} width="88" height="54" rx="7" fill="#102333" stroke="#36576d" strokeWidth="2"/><path d={`M${x+8} ${y+28}q10 -22 20 0t20 0t20 0`} stroke="#41c6d9" strokeWidth="2" fill="none"/><text x={x+44} y={y+69} textAnchor="middle" {...{fill:"#18364a",fontSize:11,fontWeight:700}}>CRO / DSO</text></g>;
  const grid = <><defs><pattern id={`dots-${experiment}`} width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#d7e2e9"/></pattern></defs><rect width="920" height="310" fill={`url(#dots-${experiment})`}/></>;
  let drawing: React.ReactNode;
  let heading = "Experiment circuit schematic";
  if (experiment === "am-generation") {
    heading = "DSB-AM generation · balanced modulator and carrier reinsertion";
    // Experiment-specific educational topology: message + carrier enter a balanced
    // modulator; the carrier is reinserted to form conventional DSB-AM; output is
    // coupled to a load and observed on the CRO. The numerical model remains below.
    drawing = <>
      <path d="M98 105H145M165 105H280V135M98 230H165M185 230H280V195M470 165H610M610 165H660M760 165H790M610 165V70H660M760 165V235H820V265" stroke="#16845f" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      {source(75,105,"Message fm")}
      {source(75,230,"Carrier fc")}
      {/* Message coupling capacitor C1 */}
      <path d="M145 92V118M157 92V118" stroke="#38566a" strokeWidth="3" />
      <text x="151" y="82" textAnchor="middle" {...label}>C1</text>
      <text x="151" y="135" textAnchor="middle" fill="#526779" fontSize="10">1 µF</text>
      {/* Carrier coupling transformer T1 */}
      <path d="M165 212c-16 0-16 12 0 12s16 12 0 12M185 212c16 0 16 12 0 12s-16 12 0 12" stroke="#38566a" strokeWidth="2.5" fill="none" />
      <text x="175" y="198" textAnchor="middle" {...label}>T1</text>
      <text x="175" y="258" textAnchor="middle" fill="#526779" fontSize="10">RF coupling</text>
      {/* Balanced modulator */}
      <rect x="280" y="105" width="190" height="120" rx="10" fill="#e7f7ff" stroke="#147da0" strokeWidth="2.5" />
      <text x="375" y="124" textAnchor="middle" {...label}>BALANCED MODULATOR</text>
      <path d="M325 145L375 165L425 145L425 185L375 205L325 185Z" fill="white" stroke="#38566a" strokeWidth="2" />
      <path d="M346 151l12 14m-12 0l12-14M392 151l12 14m-12 0l12-14" stroke="#147da0" strokeWidth="2.5" />
      <text x="375" y="220" textAnchor="middle" fill="#526779" fontSize="10">D1–D4 / switching core</text>
      <text x="288" y="130" fill="#18364a" fontSize="10" fontWeight="700">AF</text>
      <text x="288" y="210" fill="#18364a" fontSize="10" fontWeight="700">RF</text>
      {/* Carrier reinsertion oscillator and summer */}
      <rect x="660" y="42" width="100" height="56" rx="7" {...part} />
      <text x="710" y="64" textAnchor="middle" {...label}>Carrier</text>
      <text x="710" y="81" textAnchor="middle" {...label}>reinsertion</text>
      <rect x="610" y="130" width="150" height="70" rx="8" fill="#f0fdf4" stroke="#16845f" strokeWidth="2" />
      <text x="685" y="157" textAnchor="middle" {...label}>AM summing</text>
      <text x="685" y="176" textAnchor="middle" {...label}>network</text>
      <text x="685" y="215" textAnchor="middle" fill="#526779" fontSize="10">DSB-SC + carrier</text>
      {/* Output coupling capacitor and load */}
      <path d="M790 151V179M802 151V179" stroke="#38566a" strokeWidth="3" />
      <text x="796" y="140" textAnchor="middle" {...label}>C2</text>
      <text x="796" y="193" textAnchor="middle" fill="#526779" fontSize="10">10 µF</text>
      <path d="M820 235h-10l-6 -9 -12 18 -12 -18 -12 18 -8 -9h-10" stroke="#38566a" strokeWidth="2.5" fill="none" />
      <text x="785" y="254" textAnchor="middle" {...label}>RL 10 kΩ</text>
      <path d="M820 265v8m-16 0h32m-26 6h20m-14 6h8" stroke="#38566a" strokeWidth="2" fill="none" />
      {scope(810,42)}
      <text x="854" y="125" textAnchor="middle" fill="#18364a" fontSize="10" fontWeight="700">CH1 output</text>
      {node(280,135)}{node(280,195)}{node(470,165)}{node(610,165)}{node(760,165)}
      <text x="490" y="150" fill="#526779" fontSize="10">DSB-SC</text>
      <text x="815" y="295" fill="#526779" fontSize="10">Common ground</text>
    </>;
  } else if (experiment === "varactor-fm") {
    heading = "Varactor FM generator · reverse-biased varactor LC oscillator";
    drawing = <><path d="M105 160H250M250 160H360M360 160H485M485 160H650M650 160H755M485 160V95H650V160M485 160V245H650V160M250 160V245H360" {...{stroke:"#16845f",strokeWidth:3,fill:"none"}}/>{source(75,160,"Message input") }<rect x="250" y="130" width="110" height="60" rx="7" {...part}/><text x="305" y="154" textAnchor="middle" {...label}>Bias</text><text x="305" y="172" textAnchor="middle" {...label}>network</text><path d="M405 145v30m-12 -15h24m-12 -15v-15m-12 0h24" stroke="#38566a" strokeWidth="2.5" fill="none"/><text x="405" y="118" textAnchor="middle" {...label}>Dvar</text><path d="M485 160v-38m-13 0h26m-26 -8h26m-13 0v-18" stroke="#38566a" strokeWidth="2.5" fill="none"/><text x="485" y="78" textAnchor="middle" {...label}>L1</text>{capacitor(565,160,"CTank")}{resistor(650,160,"RFC") }<rect x="755" y="130" width="88" height="60" rx="7" {...part}/><text x="799" y="155" textAnchor="middle" {...label}>Buffer</text><text x="799" y="173" textAnchor="middle" {...label}>FM out</text>{node(485,160)}{node(650,160)}</>;
  } else if (experiment === "reactance-fm") {
    heading = "Reactance FM generator · transistor-controlled LC tank";
    drawing = <><path d="M100 165H235M235 165H340M340 165H510M510 165H690M690 165H780M340 165V90H510V165M340 165V245H510V165" {...{stroke:"#16845f",strokeWidth:3,fill:"none"}}/>{source(75,165,"Audio input") }<rect x="235" y="132" width="105" height="66" rx="7" {...part}/><text x="287" y="158" textAnchor="middle" {...label}>Reactance</text><text x="287" y="176" textAnchor="middle" {...label}>network</text><path d="M390 125l-20 38h40z M390 163v55m-25 0h50m-25 0v28" stroke="#38566a" strokeWidth="2.5" fill="#fff"/><text x="390" y="115" textAnchor="middle" {...label}>Q1</text><path d="M510 165v-38m-13 0h26m-26 -8h26m-13 0v-18" stroke="#38566a" strokeWidth="2.5" fill="none"/><text x="510" y="84" textAnchor="middle" {...label}>L1</text>{capacitor(600,165,"CTank")}<rect x="690" y="135" width="90" height="60" rx="7" {...part}/><text x="735" y="160" textAnchor="middle" {...label}>RF</text><text x="735" y="178" textAnchor="middle" {...label}>output</text>{scope(810,140)}</>;
  } else if (experiment === "fm-detector") {
    heading = detectorMode === "Ratio detector" ? "Ratio detector · tuned transformer and diode ratio network" : "Foster–Seeley discriminator · centre-tapped tuned transformer";
    drawing = <><path d="M95 155H210M210 155V95M210 155V220M210 95H330M210 220H330M330 95V220M330 155H420M420 155V95M420 155V220M420 95H545M420 220H545M545 95V220M545 155H700M700 155H785" {...{stroke:"#16845f",strokeWidth:3,fill:"none"}}/>{source(65,155,"FM input") }<path d="M250 80v150m18 -150v150m-18 -75h18" stroke="#38566a" strokeWidth="3" fill="none"/><text x="260" y="65" textAnchor="middle" {...label}>T1 tuned</text>{diode(370,95,"D1")}{diode(370,220,"D2")}{resistor(545,95,"RL1")}{resistor(545,220,"RL2")}{detectorMode === "Ratio detector" ? capacitor(650,155,"C ratio") : <path d="M650 120v70m-12 -35h24" stroke="#38566a" strokeWidth="2.5" fill="none"/>}<rect x="700" y="125" width="85" height="60" rx="7" {...part}/><text x="742" y="150" textAnchor="middle" {...label}>Audio</text><text x="742" y="168" textAnchor="middle" {...label}>output</text>{scope(810,128)}</>;
  } else if (experiment === "pll-fm") {
    heading = "PLL FM demodulator · closed-loop phase tracking";
    drawing = <><path d="M80 150H215M325 150H420M530 150H650M650 150V245H270V205M650 150V85H420V115" {...{stroke:"#16845f",strokeWidth:3,fill:"none"}}/>{source(55,150,"FM input")}<rect x="215" y="118" width="110" height="64" rx="7" {...part}/><text x="270" y="145" textAnchor="middle" {...label}>Phase</text><text x="270" y="163" textAnchor="middle" {...label}>detector</text><rect x="420" y="118" width="110" height="64" rx="7" {...part}/><text x="475" y="145" textAnchor="middle" {...label}>Loop LPF</text><text x="475" y="163" textAnchor="middle" {...label}>Vcontrol</text><rect x="595" y="215" width="110" height="60" rx="7" {...part}/><text x="650" y="240" textAnchor="middle" {...label}>VCO</text><text x="650" y="258" textAnchor="middle" {...label}>feedback</text><text x="425" y="75" {...label}>Recovered audio</text>{scope(780,125)}</>;
  } else if (experiment === "pcm") {
    heading = "PCM transmitter and receiver · sampling, quantization, encoding and decoding";
    const blocks = [{x:25,t:"Analog"},{x:165,t:"Sample &"},{x:305,t:"Quantizer"},{x:445,t:"Encoder"},{x:585,t:"Decoder"},{x:725,t:"DAC + LPF"}];
    drawing = <>{blocks.map((b,i)=><g key={b.t}><rect x={b.x} y="115" width="112" height="72" rx="8" {...{fill:i===5?"#e0f2fe":"#fff",stroke:i===5?"#0284c7":"#38566a",strokeWidth:2}}/><text x={b.x+56} y="145" textAnchor="middle" {...label}>{b.t}</text><text x={b.x+56} y="164" textAnchor="middle" {...label}>{["input","hold","levels","binary","rebuild","output"][i]}</text>{i<blocks.length-1&&<path d={`M${b.x+112} 151h28`} stroke="#16845f" strokeWidth="3" fill="none"/>}</g>)}<text x="445" y="90" {...label}>Serial PCM bit stream</text><path d="M445 100v-10h252v10" stroke="#16845f" strokeWidth="2" fill="none"/></>;
  } else {
    heading = "Sampling and reconstruction · sample/hold and low-pass filter";
    drawing = <><path d="M95 155H245M355 155H485M595 155H735" {...{stroke:"#16845f",strokeWidth:3,fill:"none"}}/>{source(65,155,"Message input")}<rect x="245" y="120" width="110" height="70" rx="8" {...part}/><text x="300" y="148" textAnchor="middle" {...label}>Sampling</text><text x="300" y="166" textAnchor="middle" {...label}>switch</text><rect x="485" y="120" width="110" height="70" rx="8" {...part}/><text x="540" y="148" textAnchor="middle" {...label}>Sample &</text><text x="540" y="166" textAnchor="middle" {...label}>hold</text><rect x="735" y="120" width="110" height="70" rx="8" {...part}/><text x="790" y="148" textAnchor="middle" {...label}>Reconstruction</text><text x="790" y="166" textAnchor="middle" {...label}>LPF</text><path d="M300 190v45h240v-45" stroke="#16845f" strokeWidth="2.5" fill="none"/><text x="420" y="260" textAnchor="middle" {...label}>Sampling pulse / clock</text>{scope(810,220)}</>;
  }
  return <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-extrabold uppercase tracking-[.15em] text-cyan-800">Circuit design · EduLabX practical</p><h3 className="text-lg font-bold text-slate-900">{heading}</h3></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">Experiment topology view</span></div><div className="overflow-x-auto rounded-lg border border-dashed border-slate-300 bg-[#fbfdff]"><svg viewBox="0 0 920 310" role="img" aria-label={heading} className="min-w-[700px] w-full">{grid}{drawing}</svg></div><p className="mt-2 text-xs leading-5 text-slate-500">This is the experiment-specific educational schematic associated with the mathematical model below. It is not a SPICE netlist or a claim of transistor-level electrical solving.</p></section>;
}

export default function ExperimentSimulation({ experiment, controls = true }: { experiment: string; controls?: boolean }) {
  const [messageFrequency, setMessageFrequency] = useState(500);
  const [carrierFrequency, setCarrierFrequency] = useState(100);
  const [messageAmplitude, setMessageAmplitude] = useState(2);
  const [biasVoltage, setBiasVoltage] = useState(4);
  const [deviation, setDeviation] = useState(20);
  const [amModulationIndex, setAmModulationIndex] = useState(0.5);
  const [carrierAmplitude, setCarrierAmplitude] = useState(1);
  const [loopBandwidth, setLoopBandwidth] = useState(800);
  const [samplingFrequency, setSamplingFrequency] = useState(1800);
  const [pulseWidth, setPulseWidth] = useState(20);
  const [holdTime, setHoldTime] = useState(60);
  const [inputAmplitude, setInputAmplitude] = useState(1);
  const [pcmBits, setPcmBits] = useState(4);
  const [detectorMode, setDetectorMode] = useState<"Foster-Seeley discriminator" | "Ratio detector">("Foster-Seeley discriminator");
  const [samplingMode, setSamplingMode] = useState<"Natural sampling" | "Flat-top sampling" | "Sample-and-hold" | "Reconstructed output">("Natural sampling");
  const [runState, setRunState] = useState<"stopped" | "running">("stopped");
  const [phaseTime, setPhaseTime] = useState(0);
  const [captured, setCaptured] = useState<{ id: number; ch1: number; ch2: number }[]>([]);

  useEffect(() => {
    if (runState !== "running") return;
    const timer = window.setInterval(() => setPhaseTime((value) => value + 0.04), 40);
    return () => window.clearInterval(timer);
  }, [runState]);

  const usesCarrier = ["am-generation", "varactor-fm", "reactance-fm", "fm-detector", "pll-fm"].includes(experiment);
  // Resolve RF cycles rather than undersampling a high-frequency carrier across the audio window.
  const samples = usesCarrier ? Math.max(420, Math.min(12000, Math.ceil((4 / messageFrequency) * carrierFrequency * 1000 * 12))) : 420;
  const traces = useMemo(() => {
    const duration = 4 / messageFrequency;
    const times = Array.from({ length: samples }, (_, i) => phaseTime + duration * i / (samples - 1));
    const message = times.map((t) => Math.sin(2 * Math.PI * messageFrequency * t));
    if (experiment === "am-generation") {
      const carrier = times.map((t) => carrierAmplitude * Math.cos(2 * Math.PI * carrierFrequency * 1000 * t));
      const am = times.map((t, i) => carrier[i] * (1 + amModulationIndex * message[i]));
      const envelope = message.map((m) => 1 + amModulationIndex * m);
      return { message, primary: am, primaryLabel: "DSB-AM output", secondary: carrier.map((value) => value / Math.max(1, carrierAmplitude)), secondaryLabel: "Carrier (normalized)", facts: [`Modulation index μ = ${amModulationIndex.toFixed(2)}`, `Carrier amplitude: ${carrierAmplitude.toFixed(1)} V peak`, amModulationIndex > 1 ? "Overmodulation: envelope crosses zero and becomes distorted." : "Envelope stays above zero for this modulation index."], flow: ["Message signal", "AM modulator + carrier", "DSB-AM output", "CRO / modulation index"] , envelope };
    }
    if (experiment === "varactor-fm") {
      const vj = 0.7;
      const capAtBias = (bias: number) => Math.pow(1 + Math.max(0.05, bias) / vj, -0.5);
      const cBias = capAtBias(biasVoltage);
      let phase = 0;
      const fm: number[] = [];
      const freq: number[] = [];
      for (let i = 0; i < times.length; i += 1) {
        const voltage = Math.max(0.05, biasVoltage + messageAmplitude * message[i]);
        const instantaneous = carrierFrequency * 1000 * Math.sqrt(cBias / capAtBias(voltage));
        freq.push(instantaneous);
        if (i) phase += 2 * Math.PI * ((freq[i - 1] + instantaneous) / 2) * (times[i] - times[i - 1]);
        fm.push(Math.sin(phase));
      }
      return { message, primary: fm, primaryLabel: "Varactor FM output", secondary: freq.map((f) => ((f / 1000 - carrierFrequency) / Math.max(1, deviation)) * 0.5), secondaryLabel: "Frequency shift (scaled)", facts: [`Bias junction capacitance ratio: ${cBias.toFixed(3)} C₀`, `Instantaneous frequency range: ${(Math.min(...freq) / 1000).toFixed(1)}–${(Math.max(...freq) / 1000).toFixed(1)} kHz`, "Tank inductance is chosen to center the tuned oscillator at the carrier setting."], flow: ["Message source", "Reverse-biased varactor", "Tuned LC oscillator", "FM output"] };
    }
    if (experiment === "reactance-fm") {
      const beta = (deviation * 1000) / messageFrequency;
      const fm = times.map((t) => Math.sin(2 * Math.PI * carrierFrequency * 1000 * t + beta * Math.sin(2 * Math.PI * messageFrequency * t)));
      const shift = message.map((m) => deviation * 1000 * m);
      return { message, primary: fm, primaryLabel: "FM output", secondary: shift.map((f) => f / Math.max(1, deviation * 1000)), secondaryLabel: "Instantaneous frequency shift (scaled)", facts: [`Carrier: ${carrierFrequency.toFixed(0)} kHz`, `Peak deviation: ${deviation.toFixed(0)} kHz`, `Modulation index β = Δf/fm: ${beta.toFixed(2)}`], flow: ["Carrier oscillator", "Transistor reactance stage", "Tank frequency varies", "FM output"] };
    }
    if (experiment === "fm-detector") {
      const gain = detectorMode === "Ratio detector" ? 0.72 : 1;
      const audio = message.map((m) => gain * m * (detectorMode === "Ratio detector" ? 1 : inputAmplitude));
      const inputFm = times.map((t) => Math.sin(2 * Math.PI * carrierFrequency * 1000 * t + ((deviation * 1000) / messageFrequency) * Math.sin(2 * Math.PI * messageFrequency * t)));
      return { message, primary: inputFm, primaryLabel: "FM input", secondary: audio, secondaryLabel: "Recovered output", facts: [`Selected detector: ${detectorMode}`, `Centre frequency: ${carrierFrequency.toFixed(0)} kHz`, `Peak deviation: ±${deviation.toFixed(0)} kHz`, detectorMode === "Ratio detector" ? "The normalized model rejects input-amplitude scaling." : `Output amplitude follows the discriminator slope (input amplitude ${inputAmplitude.toFixed(1)}×).`], flow: detectorMode === "Ratio detector" ? ["FM input", "Tuned transformer", "Two-diode ratio network", "Reservoir capacitor", "Audio output"] : ["FM input", "Tuned transformer", "Balanced diode arms", "Centre-tap output", "Audio output"] };
    }
    if (experiment === "pll-fm") {
      const tau = 1 / (2 * Math.PI * loopBandwidth);
      const dt = times[1] - times[0];
      const alpha = dt / (tau + dt);
      let control = 0;
      const filtered: number[] = [];
      for (let i = 0; i < message.length; i += 1) {
        control += alpha * (message[i] - control);
        filtered.push(control);
      }
      const fmInput = times.map((t) => Math.sin(2 * Math.PI * carrierFrequency * 1000 * t + ((deviation * 1000) / messageFrequency) * Math.sin(2 * Math.PI * messageFrequency * t)));
      return { message, primary: fmInput, primaryLabel: "FM input", secondary: filtered, secondaryLabel: "PLL control / recovered output", facts: [`Loop bandwidth: ${loopBandwidth.toFixed(0)} Hz`, `First-order loop time constant: ${(tau * 1000).toFixed(3)} ms`, `Maximum normalized tracking error: ${Math.max(...message.map((m, i) => Math.abs(m - filtered[i]))).toFixed(3)}`], flow: ["FM input", "Phase comparator", "Loop low-pass filter", "Control voltage → VCO", "Feedback"] };
    }
    if (experiment === "pcm") {
      const period = 1 / samplingFrequency;
      const levels = Math.pow(2, pcmBits);
      const quantize = (value: number) => {
        const normalized = Math.max(0, Math.min(levels - 1, Math.round(((value + 1) / 2) * (levels - 1))));
        return { value: (normalized / (levels - 1)) * 2 - 1, code: normalized };
      };
      const quantized = times.map((t) => {
        const sampleTime = Math.floor(t / period) * period;
        return quantize(Math.sin(2 * Math.PI * messageFrequency * sampleTime)).value;
      });
      const sampleCodes = Array.from({ length: Math.ceil(times[times.length - 1] / period) + 1 }, (_, i) =>
        quantize(Math.sin(2 * Math.PI * messageFrequency * i * period)).code
      );
      const serial = times.map((t) => {
        const sampleIndex = Math.floor(t / period);
        const sampleStart = sampleIndex * period;
        const within = (t - sampleStart) / period;
        const bitIndex = Math.min(pcmBits - 1, Math.floor(within * pcmBits));
        const code = sampleCodes[Math.min(sampleIndex, sampleCodes.length - 1)] ?? 0;
        const bit = (code >> (pcmBits - 1 - bitIndex)) & 1;
        return bit ? 0.9 : -0.9;
      });
      return {
        message,
        primary: quantized,
        primaryLabel: `Quantized ${pcmBits}-bit PCM samples`,
        secondary: serial,
        secondaryLabel: "Serial PCM bit stream",
        facts: [
          `Quantization levels: ${levels} (${pcmBits}-bit code)`,
          `Sampling frequency: ${samplingFrequency} samples/s`,
          `Nyquist check: fs ${samplingFrequency > 2 * messageFrequency ? ">" : "≤"} 2fm`,
          "The receiver converts the serial code to parallel data, performs D/A conversion and low-pass reconstruction."
        ],
        flow: ["Analog input", "Sampler + hold", "ADC / quantizer", "Parallel-to-serial", "PCM bit stream", "DAC + LPF"]
      };
    }
    if (experiment === "sampling") {
      const period = 1 / samplingFrequency;
      const pulse = pulseWidth / 100;
      const sampleAt = (t: number) => Math.sin(2 * Math.PI * messageFrequency * (Math.floor(t / period) * period));
      const natural = times.map((t, i) => (t % period) / period < pulse ? message[i] : null);
      const flat = times.map((t) => (t % period) / period < pulse ? sampleAt(t) : 0);
      const holdRatio = Math.min(1, holdTime / 100);
      const held = times.map((t) => (t % period) / period < holdRatio ? sampleAt(t) : 0);
      const reconstructed = times.map((t) => {
        const sampleIndex = Math.floor(t / period);
        const t0 = sampleIndex * period;
        const y0 = sampleAt(t0);
        const y1 = sampleAt(t0 + period);
        const fraction = (t - t0) / period;
        return y0 + (y1 - y0) * fraction;
      });
      const values = samplingMode === "Natural sampling" ? natural : samplingMode === "Flat-top sampling" ? flat : samplingMode === "Sample-and-hold" ? held : reconstructed;
      return { message, primary: values, primaryLabel: samplingMode, secondary: null, secondaryLabel: "", facts: [`Sampling theorem: fs ${samplingFrequency > 2 * messageFrequency ? ">" : "≤"} 2fm (${samplingFrequency} Hz vs ${(2 * messageFrequency).toFixed(0)} Hz)`, `Pulse width: ${pulseWidth}% of sample period`, `Hold setting: ${holdTime}% of sample period`, samplingFrequency > 2 * messageFrequency ? "Above Nyquist for the selected message frequency." : "Below Nyquist: aliasing / poor reconstruction is expected."], flow: ["Message", "Sampling pulse", samplingMode, "Low-pass reconstruction"] };
    }
    return { message, primary: message, primaryLabel: "Message", secondary: null, secondaryLabel: "", facts: [], flow: [] };
  }, [experiment, messageFrequency, carrierFrequency, messageAmplitude, biasVoltage, deviation, amModulationIndex, carrierAmplitude, loopBandwidth, samplingFrequency, pulseWidth, holdTime, inputAmplitude, detectorMode, samplingMode, phaseTime]);

  const finiteNumbers = (
    values: readonly (number | null | undefined)[]
  ): number[] => {
    const result: number[] = [];
    for (const value of values) {
      if (typeof value === "number" && Number.isFinite(value)) {
        result.push(value);
      }
    }
    return result;
  };
  const channel1: number[] = finiteNumbers(traces.primary);
  const channel2: number[] = finiteNumbers(traces.secondary ?? traces.message);
  const primaryValues = channel1;
  const secondaryValues = channel2;
  const rms = (values: number[]) => Math.sqrt(values.reduce((sum, value) => sum + value * value, 0) / Math.max(1, values.length));
  const stats = (values: number[]) => ({ rms: rms(values), vpp: Math.max(...values) - Math.min(...values), max: Math.max(...values), min: Math.min(...values) });
  const ch1Stats = stats(channel1);
  const ch2Stats = stats(channel2);
  const scopePath = (values: Point[], top: number, height: number) => {
    let drawing = false;
    return values.map((value, index) => {
      if (value === null || !Number.isFinite(value)) { drawing = false; return ""; }
      const x = index / Math.max(1, values.length - 1) * 900;
      const y = top + height / 2 - Math.max(-1.5, Math.min(1.5, value)) / 3 * height;
      const command = `${drawing ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
      drawing = true;
      return command;
    }).join(" ");
  };
  const controlsUi = controls && <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
    {experiment === "am-generation" && <>
      <RangeControl label="Message frequency" value={messageFrequency} min={100} max={2000} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Carrier frequency" value={carrierFrequency} min={50} max={250} step={5} unit="kHz" onChange={setCarrierFrequency} />
      <RangeControl label="Carrier amplitude" value={carrierAmplitude} min={0.2} max={3} step={0.1} unit="V peak" onChange={setCarrierAmplitude} />
      <RangeControl label="Modulation index μ" value={amModulationIndex} min={0.1} max={1.5} step={0.05} unit="" onChange={setAmModulationIndex} />
    </>}
    {experiment === "varactor-fm" && <>
      <RangeControl label="Message frequency" value={messageFrequency} min={100} max={2000} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Message amplitude" value={messageAmplitude} min={0.1} max={3} step={0.1} unit="V peak" onChange={setMessageAmplitude} />
      <RangeControl label="Carrier setting" value={carrierFrequency} min={50} max={250} step={5} unit="kHz" onChange={setCarrierFrequency} />
      <RangeControl label="Varactor reverse-bias voltage" value={biasVoltage} min={1} max={12} step={0.2} unit="V" onChange={setBiasVoltage} />
    </>}
    {experiment === "reactance-fm" && <>
      <RangeControl label="Message frequency" value={messageFrequency} min={100} max={2000} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Carrier frequency" value={carrierFrequency} min={50} max={250} step={5} unit="kHz" onChange={setCarrierFrequency} />
      <RangeControl label="Peak frequency deviation" value={deviation} min={2} max={60} step={1} unit="kHz" onChange={setDeviation} />
    </>}
    {experiment === "fm-detector" && <>
      <label className="block rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">Detector topology<select aria-label="Detector topology" className="mt-2 w-full rounded-md border border-slate-300 bg-white p-2" value={detectorMode} onChange={(event) => setDetectorMode(event.target.value as typeof detectorMode)}><option>Foster-Seeley discriminator</option><option>Ratio detector</option></select></label>
      <RangeControl label="Message frequency" value={messageFrequency} min={100} max={2000} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Centre frequency" value={carrierFrequency} min={50} max={250} step={5} unit="kHz" onChange={setCarrierFrequency} />
      <RangeControl label="Peak deviation" value={deviation} min={2} max={60} step={1} unit="kHz" onChange={setDeviation} />
      <RangeControl label="FM input amplitude" value={inputAmplitude} min={0.2} max={2} step={0.1} unit="×" onChange={setInputAmplitude} />
    </>}
    {experiment === "pll-fm" && <>
      <RangeControl label="Message frequency" value={messageFrequency} min={100} max={2000} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Carrier frequency" value={carrierFrequency} min={50} max={250} step={5} unit="kHz" onChange={setCarrierFrequency} />
      <RangeControl label="Peak frequency deviation" value={deviation} min={2} max={60} step={1} unit="kHz" onChange={setDeviation} />
      <RangeControl label="Loop bandwidth" value={loopBandwidth} min={100} max={3000} step={50} unit="Hz" onChange={setLoopBandwidth} />
    </>}
    {experiment === "pcm" && <>
      <RangeControl label="Message frequency" value={messageFrequency} min={100} max={1200} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Sampling frequency" value={samplingFrequency} min={500} max={6000} step={100} unit="Hz" onChange={setSamplingFrequency} />
      <label className="block rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">PCM resolution<select aria-label="PCM resolution" className="mt-2 w-full rounded-md border border-slate-300 bg-white p-2" value={pcmBits} onChange={(event) => setPcmBits(Number(event.target.value))}><option value={3}>3 bits (8 levels)</option><option value={4}>4 bits (16 levels)</option><option value={5}>5 bits (32 levels)</option><option value={6}>6 bits (64 levels)</option><option value={8}>8 bits (256 levels)</option></select></label>
    </>}
    {experiment === "sampling" && <>
      <RangeControl label="Message frequency fm" value={messageFrequency} min={100} max={1200} step={50} unit="Hz" onChange={setMessageFrequency} />
      <RangeControl label="Sampling frequency fs" value={samplingFrequency} min={200} max={5000} step={100} unit="Hz" onChange={setSamplingFrequency} />
      <RangeControl label="Sampling pulse width" value={pulseWidth} min={5} max={80} step={1} unit="%" onChange={setPulseWidth} />
      <RangeControl label="Hold time" value={holdTime} min={10} max={100} step={1} unit="%" onChange={setHoldTime} />
      <label className="block rounded-lg border border-slate-200 bg-white p-3 text-sm font-semibold text-slate-700">Sampling mode<select aria-label="Sampling mode" className="mt-2 w-full rounded-md border border-slate-300 bg-white p-2" value={samplingMode} onChange={(event) => setSamplingMode(event.target.value as typeof samplingMode)}><option>Natural sampling</option><option>Flat-top sampling</option><option>Sample-and-hold</option><option>Reconstructed output</option></select></label>
    </>}
  </div>;

  return <div className="space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div><p className="text-[10px] font-extrabold uppercase tracking-[.16em] text-cyan-800">CircuitWeb-style experiment workspace</p><h2 className="text-lg font-bold text-slate-900">{traces.flow[0]} → {traces.flow[traces.flow.length - 1]}</h2><p className="text-xs text-slate-500">Experiment-specific educational circuit model · {runState === "running" ? "live signal running" : "signal paused"}</p></div>
      <div className="flex gap-2"><button type="button" onClick={() => setRunState("running")} className="rounded-lg bg-emerald-700 px-4 py-2 text-sm font-bold text-white shadow-sm">▶ Run</button><button type="button" onClick={() => setRunState("stopped")} className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-bold text-white">Ⅱ Stop</button><button type="button" onClick={() => { setRunState("stopped"); setPhaseTime(0); setCaptured([]); }} className="rounded-lg bg-sky-700 px-4 py-2 text-sm font-bold text-white">↻ Reset</button></div>
    </div>
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(300px,.8fr)]">
      <ExperimentCircuitSchematic experiment={experiment} detectorMode={detectorMode} />
      <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="mb-3 font-bold text-slate-800">Signal and component values</h3>{controlsUi}<div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">{traces.facts.join(" ")}</div></aside>
    </div>
    <section className="rounded-xl border border-slate-700 bg-[#0b1722] p-4 text-white shadow-lg"><div className="mb-3 flex flex-wrap items-center justify-between gap-2"><div><p className="text-[10px] font-bold uppercase tracking-[.16em] text-cyan-300">Virtual instrument</p><h3 className="text-lg font-bold">CRO / Digital Storage Oscilloscope</h3><p className="text-xs text-slate-400">CH1: {traces.primaryLabel} · CH2: {traces.secondaryLabel || "Message reference"}</p></div><span className={`rounded-full px-3 py-1 text-xs font-bold ${runState === "running" ? "bg-emerald-900 text-emerald-200" : "bg-slate-700 text-slate-200"}`}>{runState === "running" ? "● LIVE" : "Ⅱ PAUSED"}</span></div>
      <svg viewBox="0 0 900 300" role="img" aria-label="Animated dual channel CRO oscilloscope" className="w-full rounded-lg bg-[#07111b]"><defs><clipPath id="scopeClip"><rect x="0" y="0" width="900" height="300" rx="6"/></clipPath></defs>{Array.from({length:19},(_,i)=><line key={`sx${i}`} x1={i*50} x2={i*50} y1="0" y2="300" stroke="#1e3445" strokeWidth="1"/>)}{Array.from({length:7},(_,i)=><line key={`sy${i}`} x1="0" x2="900" y1={i*50} y2={i*50} stroke="#1e3445" strokeWidth="1"/>)}<g clipPath="url(#scopeClip)"><path d={scopePath(primaryValues,0,145)} fill="none" stroke="#38bdf8" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/><path d={scopePath(secondaryValues ?? traces.message,150,145)} fill="none" stroke="#34d399" strokeWidth="2.5" vectorEffect="non-scaling-stroke"/></g><text x="14" y="20" fill="#38bdf8" fontSize="13" fontWeight="700">CH1 · {traces.primaryLabel}</text><text x="14" y="170" fill="#34d399" fontSize="13" fontWeight="700">CH2 · {traces.secondaryLabel || "Message reference"}</text></svg>
      <div className="mt-3 grid grid-cols-2 gap-2 md:grid-cols-4"><div className="rounded-lg bg-[#122536] p-3"><small className="text-slate-400">CH1 RMS</small><p className="font-bold text-cyan-300">{ch1Stats.rms.toFixed(3)} V</p></div><div className="rounded-lg bg-[#122536] p-3"><small className="text-slate-400">CH1 Vpp</small><p className="font-bold text-cyan-300">{ch1Stats.vpp.toFixed(3)} V</p></div><div className="rounded-lg bg-[#122536] p-3"><small className="text-slate-400">CH2 RMS</small><p className="font-bold text-emerald-300">{ch2Stats.rms.toFixed(3)} V</p></div><div className="rounded-lg bg-[#122536] p-3"><small className="text-slate-400">CH2 Vpp</small><p className="font-bold text-emerald-300">{ch2Stats.vpp.toFixed(3)} V</p></div></div>
      <div className="mt-3 flex flex-wrap gap-2"><button type="button" onClick={() => setCaptured((items) => [...items,{id:Date.now(),ch1:ch1Stats.rms,ch2:ch2Stats.rms}])} className="rounded-lg bg-emerald-700 px-3 py-2 text-xs font-bold text-white">Capture reading</button><button type="button" onClick={() => setCaptured([])} className="rounded-lg bg-slate-600 px-3 py-2 text-xs font-bold text-white">Clear readings</button><span className="self-center text-xs text-slate-400">Time base: {((4 / messageFrequency) * 1000).toFixed(1)} ms window · CH1 / CH2 calculated from model samples</span></div>
      {captured.length > 0 && <div className="mt-3 overflow-x-auto"><table className="w-full text-left text-xs"><thead><tr className="text-slate-400"><th className="p-2">#</th><th className="p-2">CH1 RMS</th><th className="p-2">CH2 RMS</th></tr></thead><tbody>{captured.map((item,index)=><tr key={item.id} className="border-t border-slate-700"><td className="p-2">{index+1}</td><td className="p-2">{item.ch1.toFixed(3)} V</td><td className="p-2">{item.ch2.toFixed(3)} V</td></tr>)}</tbody></table></div>}
    </section>
    <WaveformPlot title={`${traces.primaryLabel} and message reference`} min={experiment === "am-generation" ? -2.8 : -1.2} max={experiment === "am-generation" ? 2.8 : 1.2} traces={[{ name: "Message reference", color: "#a78bfa", values: traces.message }, { name: traces.primaryLabel, color: "#22d3ee", values: primaryValues }]} />
    {secondaryValues && <WaveformPlot title={traces.secondaryLabel} traces={[{ name: traces.secondaryLabel, color: experiment === "fm-detector" || experiment === "pll-fm" ? "#34d399" : "#fbbf24", values: secondaryValues }]} />}
    <div className="grid gap-2 sm:grid-cols-2">{traces.facts.map((fact) => <p key={fact} className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700">{fact}</p>)}</div>
  </div>;
}
