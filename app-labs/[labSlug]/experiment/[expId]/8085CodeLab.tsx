"use client";

import React, { useState } from "react";

type LabId = "mpmc-microprocessor-intro" | "mpmc-16bit-add-sub" | "mpmc-8bit-multiplication";
type Cpu = { a:number;b:number;c:number;d:number;e:number;h:number;l:number;pc:number;z:boolean;cy:boolean;halted:boolean;steps:number };
type Compiled = { start:number; bytes:number[]; listing:{address:number;bytes:number[];source:string}[] };
const hx=(n:number,w=2)=>(n& (w===4?0xffff:255)).toString(16).toUpperCase().padStart(w,"0")+"H";
const fresh=():Cpu=>({a:0,b:0,c:0,d:0,e:0,h:0,l:0,pc:0x8000,z:false,cy:false,halted:false,steps:0});
const samples:Record<LabId,string>={
 "mpmc-microprocessor-intro":`; Experiment 1 - 8085 basic instruction demonstration
; Load values, add them, and stop
ORG 8000H
MVI A, 05H
MVI B, 03H
ADD B
STA 8020H
HLT`,
 "mpmc-16bit-add-sub":`; Experiment 3 - 16-bit addition (Program A)
; HL = 3250H, BC = 1235H, result stored at 8020H/8021H
ORG 8000H
LXI H, 3250H
LXI B, 1235H
DAD B
SHLD 8020H
HLT`,
 "mpmc-8bit-multiplication":`; Experiment 4 - 8-bit multiplication by repetitive addition
; 02H x 03H = 06H, result stored at 8020H
ORG 8000H
MVI A, 00H
MVI C, 02H
MVI B, 03H
LOOP: ADD C
DCR B
JNZ LOOP
STA 8020H
HLT`
};
const subtractionSample=`; Experiment 3 - 16-bit subtraction (Program B)
; Low-byte result at 8025H, high-byte result at 8026H
; This reproduces the supplied listing: SUB B does not propagate borrow.
ORG 8000H
LXI H, 1616H
LXI B, 0A76H
MOV A, L
SUB C
STA 8025H
MOV A, H
SUB B
STA 8026H
HLT`;
const parseNum=(s:string)=>{const t=s.trim().toUpperCase();if(/^([0-9A-F]+)H$/.test(t))return parseInt(t.slice(0,-1),16);if(/^[0-9A-F]+$/.test(t))return parseInt(t,16);throw new Error(`Invalid hexadecimal value "${s}". Use forms such as 05H or 3250H.`)};
const regCode:Record<string,number>={B:0,C:1,D:2,E:3,H:4,L:5,M:6,A:7};
function compile(source:string):Compiled {
 const lines=source.split(/\r?\n/);let pc=0x8000;const labels:Record<string,number>={};
 const clean=lines.map((raw,i)=>{let line=raw.split(";")[0].trim().toUpperCase();if(!line)return null;line=line.replace(/,(\S)/g,", $1");let label:string|undefined;const m=line.match(/^([A-Z_][A-Z0-9_]*):\s*(.*)$/);if(m){label=m[1];line=m[2].trim();labels[label]=pc;}if(!line)return {i,raw,op:"",args:[],address:pc,label};const [op,...rest]=line.split(/\s+/);const args=rest.join(" ").split(",").map(v=>v.trim()).filter(Boolean);if(op==="ORG"){if(args.length!==1)throw new Error(`Line ${i+1}: ORG needs one address.`);pc=parseNum(args[0]);return {i,raw,op,args,address:pc,label};}const address=pc;let size=1;if(op==="MVI"||op==="LXI"||op==="STA"||op==="SHLD"||op==="JNZ")size=op==="MVI"?2:3;pc=(pc+size)&0xffff;return {i,raw,op,args,address,label};});
 const output:number[]=[];const listing:Compiled["listing"]=[];
 for(const item of clean){if(!item||!item.op||item.op==="ORG")continue;const {op,args,address,raw,i}=item;let bytes:number[]=[];
 const need=(n:number)=>{if(args.length!==n)throw new Error(`Line ${i+1}: ${op} expects ${n} operand(s).`);};
 const imm8=(v:string)=>{const n=parseNum(v);if(n>255)throw new Error(`Line ${i+1}: ${v} is larger than FFH.`);return n;};
 const imm16=(v:string)=>{const n=parseNum(v);if(n>65535)throw new Error(`Line ${i+1}: ${v} is larger than FFFFH.`);return n;};
 if(op==="NOP"){need(0);bytes=[0x00];}
 else if(op==="HLT"){need(0);bytes=[0x76];}
 else if(op==="MVI"){need(2);if(!(args[0] in regCode)||args[0]==="M")throw new Error(`Line ${i+1}: unsupported MVI register ${args[0]}.`);bytes=[0x06+(regCode[args[0]]<<3),imm8(args[1])];}
 else if(op==="LXI"){need(2);const codes:Record<string,number>={B:0x01,D:0x11,H:0x21,SP:0x31};if(!(args[0] in codes))throw new Error(`Line ${i+1}: LXI supports B, D, H or SP.`);const n=imm16(args[1]);bytes=[codes[args[0]],n&255,n>>8];}
 else if(op==="ADD"||op==="SUB"||op==="MOV"){need(op==="MOV"?2:1);if(op==="MOV"){if(!(args[0] in regCode)||!(args[1] in regCode))throw new Error(`Line ${i+1}: invalid MOV register.`);bytes=[0x40+(regCode[args[0]]<<3)+regCode[args[1]]];}else{if(!(args[0] in regCode))throw new Error(`Line ${i+1}: invalid ${op} register.`);bytes=[(op==="ADD"?0x80:0x90)+regCode[args[0]]];}}
 else if(op==="DAD"){need(1);const codes:Record<string,number>={B:0x09,D:0x19,H:0x29,SP:0x39};if(!(args[0] in codes))throw new Error(`Line ${i+1}: DAD supports B, D, H or SP.`);bytes=[codes[args[0]]];}
 else if(op==="DCR"){need(1);if(!(args[0] in regCode)||args[0]==="M")throw new Error(`Line ${i+1}: unsupported DCR register.`);bytes=[0x05+(regCode[args[0]]<<3)];}
 else if(op==="STA"||op==="SHLD"||op==="JNZ"){need(1);const target=op==="JNZ"&&labels[args[0]]!==undefined?labels[args[0]]:imm16(args[0]);bytes=[op==="STA"?0x32:op==="SHLD"?0x22:0xc2,target&255,target>>8];}
 else throw new Error(`Line ${i+1}: unsupported instruction "${op}". Supported: NOP, HLT, MVI, LXI, MOV, ADD, SUB, DAD, DCR, STA, SHLD, JNZ.`);
 output.push(...bytes);listing.push({address,bytes,source:raw.trim()});
 }
 if(!listing.length)throw new Error("No instructions found. Enter an 8085 assembly program.");
 return {start:listing[0].address,bytes:output,listing};
}
function execute(cpu:Cpu,mem:number[]):{cpu:Cpu;line:string}|null {
 if(cpu.halted)return null;const pc=cpu.pc&65535,op=mem[pc]??0,lo=mem[(pc+1)&65535]??0,hi=mem[(pc+2)&65535]??0,word=(hi<<8)|lo;let n={...cpu,steps:cpu.steps+1},len=1,txt="";
 const setReg=(r:number,v:number)=>{const names=["b","c","d","e","h","l","","a"] as const;const k=names[r];if(k)n[k]=v&255;};
 if(op===0x00)txt="NOP";
 else if(op===0x76){n.halted=true;txt="HLT";}
 else if([0x01,0x11,0x21].includes(op)){len=3;const pair=op===1?"BC":op===0x11?"DE":"HL";if(pair==="BC"){n.b=hi;n.c=lo;}else if(pair==="DE"){n.d=hi;n.e=lo;}else{n.h=hi;n.l=lo;}txt=`LXI ${pair}, ${hx(word,4)}`;}
 else if((op&0xc7)===0x06){len=2;setReg((op>>3)&7,lo);txt=`MVI register, ${hx(lo)}`;}
 else if((op&0xc0)===0x40 && op!==0x76){const dst=(op>>3)&7,src=op&7;const names=["B","C","D","E","H","L","M","A"];const values=[n.b,n.c,n.d,n.e,n.h,n.l,mem[(n.h<<8)|n.l]??0,n.a];setReg(dst,values[src]);txt=`MOV ${names[dst]}, ${names[src]}`;}
 else if(op===0x09){const v=((n.h<<8)|n.l)+((n.b<<8)|n.c);n.h=(v>>8)&255;n.l=v&255;n.cy=v>65535;txt="DAD B";}
 else if(op===0x81||op===0x80){const v=n.a+(op===0x81?n.c:n.b);n.a=v&255;n.cy=v>255;n.z=n.a===0;txt=op===0x81?"ADD C":"ADD B";}
 else if(op===0x91||op===0x90){const v=n.a-(op===0x91?n.c:n.b);n.a=v&255;n.cy=v<0;n.z=n.a===0;txt=op===0x91?"SUB C":"SUB B";}
 else if(op===0x05){n.b=(n.b-1)&255;n.z=n.b===0;txt="DCR B";}
 else if(op===0x32){len=3;mem[word]=n.a;txt=`STA ${hx(word,4)}`;}
 else if(op===0x22){len=3;mem[word]=n.l;mem[(word+1)&65535]=n.h;txt=`SHLD ${hx(word,4)}`;}
 else if(op===0xc2){len=3;if(!n.z){n.pc=word;len=0;}txt=`JNZ ${hx(word,4)}`;}
 else{n.halted=true;txt=`UNSUPPORTED OPCODE ${hx(op)}`;}
 if(len)n.pc=(pc+len)&65535;return {cpu:n,line:`${hx(pc,4)}  ${txt}`};
}
export default function EightOhFiveCodeLab({experimentId}:{experimentId:LabId}){
 const [source,setSource]=useState(samples[experimentId]);const [compiled,setCompiled]=useState<Compiled|null>(null);const [error,setError]=useState("");const [cpu,setCpu]=useState<Cpu>(fresh);const [memory,setMemory]=useState<number[]>(()=>Array(65536).fill(0));const [log,setLog]=useState<string[]>([]);const [status,setStatus]=useState("Edit the source and press Compile.");
 const compileNow=()=>{try{const result=compile(source);const mem=Array(65536).fill(0);result.bytes.forEach((v,i)=>mem[(result.start+i)&65535]=v);setCompiled(result);setMemory(mem);setCpu({...fresh(),pc:result.start});setLog([]);setError("");setStatus(`Compiled successfully: ${result.listing.length} source instructions, ${result.bytes.length} machine-code bytes.`);}catch(e){setCompiled(null);setError(e instanceof Error?e.message:"Compiler error");setStatus("Compilation failed.");}};
 const step=()=>{if(!compiled){setError("Compile the program before execution.");return;}const mem=memory.slice();const r=execute(cpu,mem);if(!r)return;setMemory(mem);setCpu(r.cpu);setLog(v=>[...v,r.line]);setStatus(r.cpu.halted?"Program halted. Inspect output memory.":`Executed ${r.line}.`);};
 const run=()=>{if(!compiled){setError("Compile the program before execution.");return;}let c={...cpu},m=memory.slice(),lines=[...log],guard=0;while(!c.halted&&guard++<500){const r=execute(c,m);if(!r)break;c=r.cpu;lines.push(r.line);}setCpu(c);setMemory(m);setLog(lines);setStatus(c.halted?"Execution complete. Output memory is ready.":"Execution stopped at the 500-instruction safety limit.");};
 const outputAddresses=experimentId==="mpmc-16bit-add-sub"?[0x8020,0x8021]:[0x8020];
 return <section className="overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-sm"><header className="flex flex-wrap items-center justify-between gap-3 bg-[#102235] px-4 py-4 text-white"><div><p className="text-[10px] font-black uppercase tracking-[.2em] text-cyan-300">8085 ASSEMBLER · CODE EXECUTION</p><h3 className="text-lg font-black">Assembly Editor & Compiler</h3><p className="text-xs text-slate-300">Write → Compile → Execute → Inspect output</p></div><span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold text-emerald-200">8085 ASM</span></header><div className="grid gap-4 p-4 xl:grid-cols-[1.15fr_.85fr]"><div><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><label className="text-xs font-black uppercase tracking-wider text-slate-700">Source code · .asm</label><div className="flex flex-wrap gap-2">{experimentId==="mpmc-16bit-add-sub"&&<button onClick={()=>{setSource(subtractionSample);setCompiled(null);setError("");setLog([]);setCpu(fresh());setStatus("Subtraction Program B loaded.");}} className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold">Load subtraction Program B</button>}<button onClick={()=>{setSource(samples[experimentId]);setCompiled(null);setError("");setLog([]);setCpu(fresh());setStatus("Sample program restored.");}} className="rounded border border-slate-300 px-3 py-1.5 text-xs font-bold">Restore sample</button></div></div><textarea value={source} onChange={e=>{setSource(e.target.value);setCompiled(null);setError("");}} spellCheck={false} className="min-h-[290px] w-full rounded-xl border border-slate-700 bg-[#081b27] p-4 font-mono text-xs leading-6 text-emerald-200 outline-none focus:ring-2 focus:ring-cyan-500"/><div className="mt-3 flex flex-wrap gap-2"><button onClick={compileNow} className="rounded-lg bg-cyan-800 px-4 py-2.5 text-xs font-black text-white">Compile program</button><button onClick={step} disabled={!compiled||cpu.halted} className="rounded-lg border border-cyan-700 px-4 py-2.5 text-xs font-black text-cyan-900 disabled:opacity-40">Step</button><button onClick={run} disabled={!compiled||cpu.halted} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-xs font-black text-white disabled:opacity-40">Execute / Run</button><button onClick={()=>{if(compiled){setCpu({...fresh(),pc:compiled.start});setMemory(m=>{const n=m.slice();compiled.bytes.forEach((v,i)=>n[(compiled.start+i)&65535]=v);return n;});setLog([]);setError("");setStatus("CPU reset. Compiled program retained.");}}} disabled={!compiled} className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs font-bold">Reset</button></div><p className="mt-2 text-xs text-slate-500">Supported subset: NOP, HLT, MVI, LXI, MOV, ADD, SUB, DAD, DCR, STA, SHLD and JNZ. Hex values use H suffix.</p></div><div className="space-y-3"><div className="rounded-xl border border-slate-200 bg-slate-50 p-3"><p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Compiler status</p><p className="mt-1 text-sm font-bold text-slate-800">{status}</p>{error&&<p className="mt-2 rounded bg-red-50 p-2 text-xs font-semibold text-red-800">{error}</p>}</div><div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-black uppercase tracking-wider text-slate-700">Generated machine code · HEX</p>{compiled?<div className="mt-2 space-y-1">{compiled.listing.map((r,i)=><div key={i} className="grid grid-cols-[68px_1fr] gap-2 rounded bg-slate-50 p-2 font-mono text-[11px]"><span className="font-bold text-cyan-900">{hx(r.address,4)}</span><span className="text-slate-700">{r.bytes.map(v=>hx(v).replace("H","")).join(" ") } <span className="font-sans text-slate-500">· {r.source}</span></span></div>)}</div>:<p className="mt-2 text-xs text-slate-400">Compile the source to generate opcodes and addresses.</p>}</div><div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-black uppercase tracking-wider text-slate-700">CPU output registers</p><div className="mt-2 grid grid-cols-4 gap-2">{(["a","b","c","d","e","h","l"] as const).map(k=><div key={k} className="rounded bg-slate-50 p-2"><p className="text-[9px] font-bold uppercase text-slate-500">{k}</p><p className="font-mono font-black text-slate-900">{hx(cpu[k])}</p></div>)}</div><p className="mt-2 text-xs text-slate-600">PC: <b className="font-mono">{hx(cpu.pc,4)}</b> · Z: {cpu.z?1:0} · CY: {cpu.cy?1:0} · {cpu.halted?"HALTED":"READY"}</p></div><div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-black uppercase tracking-wider text-slate-700">Output memory</p>{outputAddresses.map(a=><div key={a} className="mt-2 flex justify-between rounded bg-emerald-50 p-2 font-mono text-xs"><span>{hx(a,4)}</span><b>{compiled?hx(memory[a]):"--"}</b></div>)}</div><div className="rounded-xl border border-slate-200 p-3"><p className="text-xs font-black uppercase tracking-wider text-slate-700">Execution trace</p><div className="mt-2 max-h-36 space-y-1 overflow-auto">{log.length?log.map((line,i)=><p key={i} className="rounded bg-slate-50 p-1.5 font-mono text-[10px]">{line}</p>):<p className="text-xs text-slate-400">No instructions executed yet.</p>}</div></div></div></div></section>;
}
