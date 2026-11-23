"use client";

import React, { useMemo, useState } from "react";

export type MPMC8051ExperimentId =
  | "mpmc-8051-add-sub-8bit"
  | "mpmc-8051-mul-div-8bit"
  | "mpmc-8051-logical-8bit"
  | "mpmc-8051-add-sub-16bit"
  | "mpmc-8051-mask-nibble"
  | "mpmc-8051-smallest-three"
  | "mpmc-8051-sort-ascending"
  | "mpmc-8051-led-interfacing"
  | "mpmc-8051-lcd-interfacing";

const names: Record<MPMC8051ExperimentId, string> = {
  "mpmc-8051-add-sub-8bit": "8-bit addition and subtraction",
  "mpmc-8051-mul-div-8bit": "8-bit multiplication and division",
  "mpmc-8051-logical-8bit": "8-bit logical operations",
  "mpmc-8051-add-sub-16bit": "16-bit addition and subtraction",
  "mpmc-8051-mask-nibble": "higher-nibble masking",
  "mpmc-8051-smallest-three": "smallest of three unsigned bytes",
  "mpmc-8051-sort-ascending": "ascending-order sorting",
  "mpmc-8051-led-interfacing": "LED interfacing",
  "mpmc-8051-lcd-interfacing": "LCD ECE display",
};
const hex = (n: number, width = 2) => (n >>> 0).toString(16).toUpperCase().padStart(width, "0") + "H";
const clamp = (n: number, max: number) => Math.max(0, Math.min(max, Number.isFinite(n) ? Math.trunc(n) : 0));

export default function MPMC8051Simulator({ experimentId }: { experimentId: MPMC8051ExperimentId }) {
  const [a, setA] = useState("3");
  const [b, setB] = useState("1");
  const [c, setC] = useState("2");
  const [d, setD] = useState("4");
  const [values, setValues] = useState("9, 3, 7, 1, 5");
  const [ledOn, setLedOn] = useState(false);
  const [ran, setRan] = useState(true);
  const [lcdText, setLcdText] = useState("ECE");
  const x = clamp(Number(a), 255), y = clamp(Number(b), 255), z = clamp(Number(c), 255), w = clamp(Number(d), 255);
  const result = useMemo(() => {
    const x16 = clamp(Number(a), 65535), y16 = clamp(Number(b), 65535);
    const list = values.split(/[ ,]+/).filter(Boolean).map(v => clamp(Number(v), 255)).slice(0, 8);
    switch (experimentId) {
      case "mpmc-8051-add-sub-8bit": return [
        ["A + R0", hex(x + y), `P0 = ${hex((x + y) & 255)} · CY = ${(x + y) > 255 ? 1 : 0}`],
        ["A − R0", hex((x - y + 256) & 255), `P1 = ${hex((x - y + 256) & 255)} · borrow = ${x < y ? 1 : 0}`],
      ];
      case "mpmc-8051-mul-div-8bit": return [
        ["MUL AB · product", hex(x * y, 4), `A (low) = ${hex((x * y) & 255)} · B (high) = ${hex((x * y) >> 8)}`],
        ["DIV AB · quotient/remainder", y === 0 ? "DIVIDE BY ZERO" : hex(Math.floor(x / y)), y === 0 ? "8051 DIV AB with B=0 sets OV; quotient is undefined." : `A (quotient) = ${hex(Math.floor(x / y))} · B (remainder) = ${hex(x % y)}`],
      ];
      case "mpmc-8051-logical-8bit": return [["ANL A,R0", hex(x & y), `P0 = ${hex(x & y)}`], ["ORL A,R0", hex(x | y), `P1 = ${hex(x | y)}`], ["XRL A,R0", hex(x ^ y), "Additional XOR observation"]];
      case "mpmc-8051-add-sub-16bit": return [["16-bit addition", hex(x16 + y16, 4), `Low byte = ${hex((x16 + y16) & 255)} · high byte = ${hex((x16 + y16) >> 8)} · carry out = ${x16 + y16 > 65535 ? 1 : 0}`], ["16-bit subtraction", hex((x16 - y16 + 65536) & 65535, 4), `Low byte = ${hex((x16 - y16 + 65536) & 255)} · high byte = ${hex(((x16 - y16 + 65536) >> 8) & 255)} · borrow = ${x16 < y16 ? 1 : 0}`]];
      case "mpmc-8051-mask-nibble": return [["ANL A,#0FH · clear upper nibble", hex(x & 0x0f), `Input ${hex(x)} AND 0FH = ${hex(x & 0x0f)}`], ["ANL A,#0F0H · isolate upper nibble", hex(x & 0xf0), `Upper nibble value = ${hex(x & 0xf0)}`]];
      case "mpmc-8051-smallest-three": { const m = Math.min(x, y, z); return [["Smallest unsigned byte", hex(m), `Compared ${hex(x)}, ${hex(y)} and ${hex(z)}; result stored at 33H in the example data layout.`]]; }
      case "mpmc-8051-sort-ascending": { const sorted = [...list].sort((m,n)=>m-n); return [["Input byte array", list.map(v=>hex(v)).join(" · ") || "No values", "Up to eight unsigned bytes are accepted."], ["Sorted array", sorted.map(v=>hex(v)).join(" · ") || "No values", "Ascending order · equal values are retained."]]; }
      case "mpmc-8051-led-interfacing": return [["P1.0 output latch", ledOn ? "1 · HIGH" : "0 · LOW", ledOn ? "Virtual LED is ON in active-high mode." : "Virtual LED is OFF in active-high mode."]];
      case "mpmc-8051-lcd-interfacing": return [["LCD data display", lcdText.slice(0,16) || "(blank)", "Educational 16-character display preview; physical pin mapping and LCD timing depend on the trainer board."]];
    }
  }, [experimentId, x, y, z, x16Safe(a), x16Safe(b), values, ledOn, lcdText]);
  const reset = () => { setA("3"); setB("1"); setC("2"); setD("4"); setValues("9, 3, 7, 1, 5"); setLedOn(false); setLcdText("ECE"); setRan(false); };
  return <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
    <div className="bg-[#102235] px-5 py-4 text-white"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">8051 Virtual Practical Bench</p><h2 className="mt-1 text-xl font-extrabold">{names[experimentId]}</h2><p className="mt-1 text-sm text-slate-300">Interactive educational model of the selected operation and its observable register/port results.</p></div>
    <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,.85fr)]">
      <div className="space-y-4">
        {(experimentId.includes("smallest") ? <div className="grid grid-cols-3 gap-3">{[["Number 1",a,setA],["Number 2",b,setB],["Number 3",c,setC]].map(([label,val,setter]: any)=><label key={label} className="text-xs font-bold text-slate-600">{label}<input type="number" min="0" max="255" value={val} onChange={e=>{setter(e.target.value);setRan(false)}} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"/></label>)}</div> : null)}
        {(experimentId.includes("sort") ? <label className="block text-xs font-bold text-slate-600">Unsigned byte list (decimal, comma separated)<input value={values} onChange={e=>{setValues(e.target.value);setRan(false)}} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"/></label> : null)}
        {(experimentId.includes("lcd") ? <label className="block text-xs font-bold text-slate-600">LCD text (up to 16 characters)<input value={lcdText} maxLength={16} onChange={e=>{setLcdText(e.target.value);setRan(false)}} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"/></label> : null)}
        {(experimentId.includes("led") ? <div className="rounded-xl border border-slate-200 bg-slate-50 p-4"><p className="text-sm font-bold text-slate-700">P1.0 switch</p><button onClick={()=>{setLedOn(v=>!v);setRan(false)}} className={`mt-3 rounded-lg px-4 py-2 text-sm font-bold text-white ${ledOn?"bg-emerald-700":"bg-slate-600"}`}>{ledOn?"Set LOW / LED OFF":"Set HIGH / LED ON"}</button><div className="mt-4 flex items-center gap-3"><span className={`h-9 w-9 rounded-full border-2 ${ledOn?"border-emerald-600 bg-emerald-400 shadow-[0_0_18px_#34d399]":"border-slate-400 bg-slate-200"}`}/><span className="text-sm font-semibold">Virtual LED: {ledOn?"ON":"OFF"}</span></div></div>:null)}
        {(!experimentId.includes("smallest") && !experimentId.includes("sort") && !experimentId.includes("lcd") && !experimentId.includes("led")) ? <div className="grid grid-cols-2 gap-3">{[["Operand A / first value",a,setA,experimentId.includes("16bit")?65535:255],["Operand B / second value",b,setB,experimentId.includes("16bit")?65535:255],...(experimentId.includes("mask")?[]:[])].map(([label,val,setter,max]: any)=><label key={label} className="text-xs font-bold text-slate-600">{label}<input type="number" min="0" max={max} value={val} onChange={e=>{setter(e.target.value);setRan(false)}} className="mt-1 w-full rounded-lg border border-slate-300 p-2 text-sm"/></label>)}</div>:null}
        <div className="flex flex-wrap gap-2"><button onClick={()=>setRan(true)} className="rounded-lg bg-[#0b5c9e] px-5 py-2.5 text-sm font-bold text-white hover:bg-blue-800">Run demonstration</button><button onClick={reset} className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-bold text-slate-700">Reset</button></div>
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs leading-5 text-amber-950"><strong>Simulation scope:</strong> This is an experiment-specific educational model of the expected 8051 operation and observable results. It does not execute arbitrary user-entered A51 machine code or emulate every timing/electrical characteristic of a physical trainer. Verify board-specific port wiring and logic levels before hardware use.</div>
      </div>
      <div className="space-y-3">
        <div className="rounded-xl bg-slate-900 p-4 text-white">
          <p className="text-[10px] font-bold uppercase tracking-widest text-cyan-300">8051 register / port observation · model state</p>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {[
              ["A", ran ? (experimentId.includes("lcd") ? "—" : hex(experimentId.includes("mul-div") ? (x*y)&255 : experimentId.includes("logical") ? (x&y) : experimentId.includes("mask") ? (x&15) : experimentId.includes("smallest") ? Math.min(x,y,z) : experimentId.includes("sort") ? (values.split(/[ ,]+/).filter(Boolean).map(v=>clamp(Number(v),255))[0] ?? 0) : experimentId.includes("led") ? (ledOn?1:0) : (x+y)&255)) : "—"],
              ["B", ran ? (experimentId.includes("mul-div") ? hex((x*y)>>8) : experimentId.includes("lcd") ? "—" : hex(y)) : "—"],
              ["CY", ran ? (experimentId.includes("add-sub-16") ? (x+y>65535?"1":"0") : experimentId.includes("add-sub-8") ? (x+y>255?"1":"0") : "0") : "—"],
              ["R0", ran ? hex(y) : "—"],
              ["P0", ran ? (experimentId.includes("led") ? (ledOn?"01H":"00H") : experimentId.includes("lcd") ? "LCD DATA" : experimentId.includes("logical") ? hex(x&y) : experimentId.includes("add-sub-8") ? hex((x+y)&255) : "—") : "—"],
              ["P1", ran ? (experimentId.includes("led") ? (ledOn?"01H":"00H") : experimentId.includes("lcd") ? "LCD CTRL*" : experimentId.includes("logical") ? hex(x|y) : experimentId.includes("add-sub-8") ? hex((x-y+256)&255) : "—") : "—"]
            ].map(([k,v])=><div key={k} className="rounded-lg bg-white/10 p-3"><p className="text-[10px] font-bold text-slate-300">{k}</p><p className="mt-1 break-words font-mono text-sm font-extrabold">{v}</p></div>)}
          </div>
          <p className="mt-2 text-[10px] leading-4 text-slate-400">*Illustrative port assignment only. Confirm your trainer's wiring before using physical hardware.</p>
        </div>
        {experimentId.includes("lcd") && ran ? <div className="rounded-xl border border-slate-300 bg-slate-800 p-4">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-widest text-emerald-300">HD44780-compatible 16×2 LCD preview</p>
          <div className="rounded-md border-4 border-slate-500 bg-[#b7c99b] p-3 shadow-inner">
            <div className="font-mono text-sm font-bold tracking-widest text-[#26351f]">
              <div className="grid gap-x-1" style={{gridTemplateColumns:"repeat(16,minmax(0,1fr))"}}>{Array.from({length:16},(_,i)=><span key={i} className="min-h-5">{lcdText.padEnd(16," ").slice(0,16).charAt(i)}</span>)}</div>
              <div className="grid gap-x-1" style={{gridTemplateColumns:"repeat(16,minmax(0,1fr))"}}>{Array.from({length:16},(_,i)=><span key={i} className="min-h-5">{" ".charAt(0)}</span>)}</div>
            </div>
          </div>
          <p className="mt-2 text-[10px] text-slate-400">Visual character preview; LCD electrical timing and pin-level bus transfers are not emulated here.</p>
        </div> : null}
        <div className="rounded-xl border border-slate-200 p-4">
          <p className="text-xs font-extrabold uppercase tracking-widest text-slate-500">{ran?"Observed model output":"Output waiting"}</p>
          {ran?<div className="mt-3 space-y-3">{result?.map(([label,value,note])=><div key={label} className="rounded-lg bg-slate-50 p-3"><p className="text-xs font-bold text-slate-500">{label}</p><p className="mt-1 break-words font-mono text-xl font-black text-[#0b5c9e]">{value}</p><p className="mt-1 text-xs leading-5 text-slate-600">{note}</p></div>)}</div>:<p className="mt-3 text-sm text-slate-500">Enter values or select the peripheral state, then run the demonstration to see the result.</p>}
        </div>
      </div>
    </div>
  </section>;
}
function x16Safe(v: string) { return clamp(Number(v), 65535); }
