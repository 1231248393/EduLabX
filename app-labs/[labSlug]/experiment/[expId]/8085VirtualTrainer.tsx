"use client";

import React, { useMemo, useState } from "react";

type Mode = "idle" | "set-address" | "write-byte" | "examine-memory" | "examine-register";
type CPU = { a:number; b:number; c:number; d:number; e:number; h:number; l:number; pc:number; sp:number; z:boolean; cy:boolean; halted:boolean; steps:number };
type LogEntry = { address:number; opcode:number; text:string; detail:string };

const H = (n:number, width=2) => (n & (width===4 ? 0xffff : 0xff)).toString(16).toUpperCase().padStart(width,"0");
const freshCPU = ():CPU => ({a:0,b:0,c:0,d:0,e:0,h:0,l:0,pc:0x8000,sp:0xffff,z:false,cy:false,halted:false,steps:0});
const byte = (v:number) => v & 0xff;
const word = (hi:number,lo:number) => ((hi&255)<<8)|(lo&255);

const componentInfo = [
  ["8085 CPU","8-bit processor","Fetches instructions from memory, decodes each opcode and controls execution."],
  ["ALU","Arithmetic and logic unit","Performs arithmetic and logical operations such as ADD, SUB, AND, OR and comparisons."],
  ["Accumulator A","8-bit register","Stores one ALU operand and receives arithmetic/logic results."],
  ["B, C, D, E, H, L","General-purpose registers","Six 8-bit registers. B-C, D-E and H-L can be used as 16-bit register pairs."],
  ["Program Counter","16-bit register","Holds the memory address of the next instruction byte to fetch."],
  ["Stack Pointer","16-bit register","Points to the top of the stack in memory. Used by stack and subroutine instructions."],
  ["Address bus","16-bit address path","Selects one of the memory or I/O locations."],
  ["Data bus","8-bit data path","Carries opcode bytes, operands and data between CPU, memory and I/O."],
  ["Timing & control","Control signals","Coordinates memory read/write and I/O operations during instruction execution."],
  ["RAM","Program and data storage","Stores the entered opcode bytes and result bytes. This trainer model uses a 64 KB address space."]
] as const;

const examples = {
  addition: {
    title:"16-bit addition · Experiment 3",
    description:"Load 3250H into HL, load 1235H into BC, add BC to HL and store the result.",
    bytes:[0x21,0x50,0x32,0x01,0x35,0x12,0x09,0x22,0x20,0x80,0x76],
    start:0x8000
  },
  multiplication: {
    title:"8-bit multiplication · Experiment 4",
    description:"Multiply 02H by 03H using repeated addition. C holds the multiplicand; B is the repeat counter.",
    bytes:[0x3e,0x00,0x0e,0x02,0x06,0x03,0x81,0x05,0xc2,0x06,0x80,0x32,0x20,0x80,0x76],
    start:0x8000
  }
} as const;

function executeOne(cpu:CPU, mem:number[]):{cpu:CPU; entry:LogEntry} | null {
  if (cpu.halted) return null;
  const pc = cpu.pc & 0xffff;
  const op = mem[pc] ?? 0;
  let n = {...cpu, steps:cpu.steps+1};
  let len = 1;
  let text = `DB ${H(op)}H`;
  let detail = "Unsupported opcode in this learning model. The CPU has stopped to avoid inventing an operation.";
  const imm8 = mem[(pc+1)&0xffff] ?? 0;
  const imm16 = word(mem[(pc+2)&0xffff] ?? 0, imm8);

  switch(op) {
    case 0x00: text="NOP"; detail="No operation. The processor advances to the next instruction."; break;
    case 0x21: len=3; text=`LXI H, ${H(imm16,4)}`; n.h=imm16>>8; n.l=imm16&255; detail="Load the 16-bit immediate value into H and L."; break;
    case 0x01: len=3; text=`LXI B, ${H(imm16,4)}`; n.b=imm16>>8; n.c=imm16&255; detail="Load the 16-bit immediate value into B and C."; break;
    case 0x11: len=3; text=`LXI D, ${H(imm16,4)}`; n.d=imm16>>8; n.e=imm16&255; detail="Load the 16-bit immediate value into D and E."; break;
    case 0x3e: len=2; text=`MVI A, ${H(imm8)}`; n.a=imm8; detail="Load the immediate byte into accumulator A."; break;
    case 0x06: len=2; text=`MVI B, ${H(imm8)}`; n.b=imm8; detail="Load the immediate byte into register B."; break;
    case 0x0e: len=2; text=`MVI C, ${H(imm8)}`; n.c=imm8; detail="Load the immediate byte into register C."; break;
    case 0x16: len=2; text=`MVI D, ${H(imm8)}`; n.d=imm8; detail="Load the immediate byte into register D."; break;
    case 0x1e: len=2; text=`MVI E, ${H(imm8)}`; n.e=imm8; detail="Load the immediate byte into register E."; break;
    case 0x26: len=2; text=`MVI H, ${H(imm8)}`; n.h=imm8; detail="Load the immediate byte into register H."; break;
    case 0x2e: len=2; text=`MVI L, ${H(imm8)}`; n.l=imm8; detail="Load the immediate byte into register L."; break;
    case 0x09: { const v=word(cpu.h,cpu.l)+word(cpu.b,cpu.c); n.h=(v>>8)&255; n.l=v&255; n.cy=v>0xffff; text="DAD B"; detail="The ALU adds the BC register pair to HL. The 16-bit result remains in HL; CY indicates overflow."; break; }
    case 0x22: len=3; text=`SHLD ${H(imm16,4)}`; mem[imm16]=cpu.l; mem[(imm16+1)&0xffff]=cpu.h; detail=`Store L at ${H(imm16,4)} and H at ${H((imm16+1)&0xffff,4)}.`; break;
    case 0x32: len=3; text=`STA ${H(imm16,4)}`; mem[imm16]=cpu.a; detail=`Store accumulator A at memory location ${H(imm16,4)}.`; break;
    case 0x7d: text="MOV A, L"; n.a=cpu.l; detail="Copy register L into accumulator A."; break;
    case 0x7c: text="MOV A, H"; n.a=cpu.h; detail="Copy register H into accumulator A."; break;
    case 0x91: { const v=cpu.a-cpu.c; n.a=byte(v); n.cy=v<0; n.z=byte(v)===0; text="SUB C"; detail="Subtract C from A. CY indicates borrow and Z indicates a zero result."; break; }
    case 0x98: { const v=cpu.a-cpu.b; n.a=byte(v); n.cy=v<0; n.z=byte(v)===0; text="SUB B"; detail="Subtract B from A. This reproduces the supplied practical listing; it is not SBB."; break; }
    case 0x81: { const v=cpu.a+cpu.c; n.a=byte(v); n.cy=v>255; n.z=byte(v)===0; text="ADD C"; detail=`ALU adds C (${H(cpu.c)}) to A. New accumulator value: ${H(n.a)}.`; break; }
    case 0x05: n.b=byte(cpu.b-1); n.z=n.b===0; text="DCR B"; detail=`Decrease B by one. B is now ${H(n.b)}; Z is ${n.z?1:0}.`; break;
    case 0xc2: len=3; text=`JNZ ${H(imm16,4)}`; if(!cpu.z){ n.pc=imm16; len=0; } detail=cpu.z?"Z=1, so the jump is not taken.":"Z=0, so execution jumps to the target address."; break;
    case 0x76: n.halted=true; text="HLT"; detail="Halt instruction reached. The processor stops; inspect the memory output."; break;
    default: n.halted=true;
  }
  if (len!==0) n.pc=(pc+len)&0xffff;
  return {cpu:n, entry:{address:pc,opcode:op,text,detail}};
}

function Key({label,onClick,accent=false}:{label:string;onClick:()=>void;accent?:boolean}) {
  return <button type="button" onClick={onClick} className={`min-h-11 rounded-md border px-2 py-2 text-sm font-black shadow-[0_2px_0_rgba(15,23,42,.18)] active:translate-y-px ${accent?"border-amber-300 bg-amber-100 text-amber-950 hover:bg-amber-200":"border-slate-300 bg-slate-100 text-slate-800 hover:bg-white"}`}>{label}</button>;
}

export default function EightOhFiveTrainer({ initialProgram }: { initialProgram?: "addition" | "multiplication" }) {
  const [memory,setMemory] = useState<number[]>(()=>{const m=Array(65536).fill(0);if(initialProgram)examples[initialProgram].bytes.forEach((v,i)=>m[examples[initialProgram].start+i]=v);return m;});
  const [cpu,setCpu] = useState<CPU>(()=>({...freshCPU(),pc:initialProgram?examples[initialProgram].start:0x8000}));
  const [mode,setMode] = useState<Mode>("idle");
  const [address,setAddress] = useState(0x8000);
  const [buffer,setBuffer] = useState("");
  const [display,setDisplay] = useState(initialProgram?`8000${H(examples[initialProgram].bytes[0])}`:"800000");
  const [status,setStatus] = useState(initialProgram?`${examples[initialProgram].title} preloaded at 8000H. Use SINGLE STEP or GO.`:"Power on · press M SET to enter a memory address.");
  const [log,setLog] = useState<LogEntry[]>([]);
  const [selected,setSelected] = useState(0);
  const [memoryPage,setMemoryPage] = useState(0x8000);
  const [lastAction,setLastAction] = useState("Waiting for a trainer key.");
  const [view,setView] = useState<"trainer"|"components">("trainer");

  const displayAddress = (addr:number,data=memory[addr]??0) => setDisplay(`${H(addr,4)}${H(data)}`);
  const setMemByte = (addr:number,val:number) => setMemory(prev=>{const next=prev.slice();next[addr&0xffff]=byte(val);return next;});
  const appendKey = (k:string) => {
    if(mode==="set-address" && buffer.length<4) {
      const next=buffer+k; setBuffer(next);
      setDisplay(`${next.padEnd(4,"_")}--`);
      setLastAction(`Address entry: ${next}`);
    } else if(mode==="write-byte" && buffer.length<2) {
      const next=buffer+k; setBuffer(next);
      setDisplay(`${H(address,4)}${next.padEnd(2,"_")}`);
      setLastAction(`Data entry at ${H(address,4)}: ${next}`);
    } else {
      setStatus("Select M SET, IN BYTE or EXAM MEM before entering hexadecimal digits.");
    }
  };
  const startAddressEntry = (nextMode:Mode) => {setMode(nextMode);setBuffer("");setStatus(nextMode==="set-address"?"Enter a four-digit hexadecimal start address, then press NEXT.":"Enter a four-digit hexadecimal address to examine, then press NEXT.");};
  const commitAddress = () => {
    if(buffer.length!==4){setStatus("Enter exactly four hexadecimal digits before pressing NEXT.");return;}
    const addr=parseInt(buffer,16);setAddress(addr);setMemoryPage(addr);setBuffer("");setMode(mode==="set-address"?"write-byte":"examine-memory");displayAddress(addr);setStatus(mode==="set-address"?`Address ${H(addr,4)} selected. Enter a two-digit byte, then press NEXT to store it.`:`Memory ${H(addr,4)} = ${H(memory[addr]??0)}. Press NEXT to inspect the next address.`);
  };
  const commitByte = () => {
    if(buffer.length!==2){setStatus("Enter exactly two hexadecimal digits before pressing NEXT.");return;}
    const value=parseInt(buffer,16);setMemByte(address,value);displayAddress(address,value);setLastAction(`Wrote ${H(value)} to ${H(address,4)}.`);
    setAddress((address+1)&0xffff);setBuffer("");setStatus(`Stored ${H(value)}. Enter next byte or press RESET to leave entry mode.`);
  };
  const pressNext = () => {
    if(mode==="set-address" || (mode==="examine-memory" && buffer.length===4)) {commitAddress();return;}
    if(mode==="examine-memory" && buffer.length===0) {const next=(address+1)&0xffff;setAddress(next);displayAddress(next);setStatus(`Memory ${H(next,4)} = ${H(memory[next]??0)}. Press NEXT to inspect the next address.`);return;}
    if(mode==="write-byte") {commitByte();return;}
    if(mode==="examine-register") {const next=(selected+1)%registers.length;setSelected(next);const [name,value]=registers[next];setDisplay(`${name.padEnd(2,"_")}${H(value,4)}`);setStatus(`Register ${name} = ${H(value,name==="PC"||name==="SP"?4:2)}.`);return;}
    setAddress(a=>(a+1)&0xffff);displayAddress((address+1)&0xffff);
  };
  const pressButton = (name:string) => {
    setLastAction(`${name} key pressed.`);
    if(name==="RESET"){setCpu(freshCPU());setMode("idle");setBuffer("");setLog([]);setStatus("CPU reset. RAM contents are preserved, as in a trainer learning model.");setDisplay(`${H(address,4)}${H(memory[address]??0)}`);return;}
    if(name==="M SET"){startAddressEntry("set-address");return;}
    if(name==="EXAM MEM"){startAddressEntry("examine-memory");return;}
    if(name==="IN BYTE"){setMode("write-byte");setBuffer("");setStatus(`Enter a two-digit byte for memory ${H(address,4)}, then press NEXT.`);return;}
    if(name==="EXAM REG"){setMode("examine-register");setSelected(0);setStatus(`Register examination mode. A = ${H(cpu.a)}. Use NEXT to cycle through CPU registers.`);setDisplay(`A_${H(cpu.a,4)}`);return;}
    if(name==="NEXT"){pressNext();return;}
    if(name==="PREV"){setAddress(a=>(a-1)&0xffff);displayAddress((address-1)&0xffff);return;}
    if(name==="EXEC"){stepCPU();return;}
    if(name==="SINGLE STEP"){stepCPU();return;}
    if(name==="GO"){runCPU();return;}
    if(name==="OUT BYTE"){displayAddress(address);setStatus(`Output display shows memory ${H(address,4)} and data ${H(memory[address]??0)}.`);return;}
    if(name==="BLK MOVE"){setStatus("Block move is not implemented in this first trainer phase.");return;}
    if(name==="BLK HOME"){setAddress(0x8000);displayAddress(0x8000);setStatus("Address cursor returned to 8000H.");return;}
    if(name==="COMP"){setStatus("Compare function is reserved for a later trainer phase.");return;}
    if(name==="DELETE"){setBuffer("");setStatus("Current hexadecimal entry cleared.");return;}
    if(name==="GO HOME"){setCpu(c=>({...c,pc:0x8000,halted:false}));setStatus("Program counter set to 8000H.");return;}
  };
  const stepCPU = () => {
    setCpu(current=>{
      const result=executeOne(current,memory.slice());
      if(!result){setStatus("CPU is halted. Press RESET or set PC to run again.");return current;}
      setMemory(prev=>{const next=prev.slice(); if(result.entry.text.startsWith("SHLD")){const insAddr=result.entry.address;const target=prev[(insAddr+1)&0xffff]|(prev[(insAddr+2)&0xffff]<<8);next[target]=current.l;next[(target+1)&0xffff]=current.h;} if(result.entry.text.startsWith("STA")){const insAddr=result.entry.address;const target=prev[(insAddr+1)&0xffff]|(prev[(insAddr+2)&0xffff]<<8);next[target]=current.a;} return next;});
      setLog(old=>[...old,result.entry]);setAddress(result.entry.address);setDisplay(`${H(result.entry.address,4)}${H(result.entry.opcode)}`);setStatus(`${result.entry.text} · ${result.entry.detail}`);setLastAction(`Executed ${result.entry.text} at ${H(result.entry.address,4)}.`);
      return result.cpu;
    });
  };
  const runCPU = () => {
    let nextCpu={...cpu}; const nextMem=memory.slice(); const newLog:LogEntry[]=[]; let guard=0;
    while(!nextCpu.halted && guard++<500) {
      const result=executeOne(nextCpu,nextMem); if(!result)break;
      const ins=result.entry;
      if(ins.text.startsWith("SHLD")){const target=nextMem[(ins.address+1)&0xffff]|(nextMem[(ins.address+2)&0xffff]<<8);nextMem[target]=nextCpu.l;nextMem[(target+1)&0xffff]=nextCpu.h;}
      if(ins.text.startsWith("STA")){const target=nextMem[(ins.address+1)&0xffff]|(nextMem[(ins.address+2)&0xffff]<<8);nextMem[target]=nextCpu.a;}
      newLog.push(ins);nextCpu=result.cpu;
    }
    setCpu(nextCpu);setMemory(nextMem);setLog(old=>[...old,...newLog]);setAddress(nextCpu.pc);displayAddress(nextCpu.pc,nextMem[nextCpu.pc]??0);
    setStatus(nextCpu.halted?`Program stopped after ${newLog.length} instruction executions.`:"Execution limit reached (500 instructions). Check the program loop.");
    setLastAction(`GO completed · ${newLog.length} instruction(s) executed.`);
  };
  const loadExample = (kind:"addition"|"multiplication") => {
    const ex=examples[kind];const next=memory.slice();ex.bytes.forEach((v,i)=>next[ex.start+i]=v);
    setMemory(next);setAddress(ex.start);setMemoryPage(ex.start);setCpu({...freshCPU(),pc:ex.start});setMode("idle");setBuffer("");setLog([]);displayAddress(ex.start,next[ex.start]);
    setStatus(`${ex.title} loaded into RAM at ${H(ex.start,4)}. Use SINGLE STEP or GO to execute.`);setLastAction(`Loaded ${ex.title} example.`);setView("trainer");
  };
  const registers=[["A",cpu.a],["B",cpu.b],["C",cpu.c],["D",cpu.d],["E",cpu.e],["H",cpu.h],["L",cpu.l],["PC",cpu.pc],["SP",cpu.sp]] as const;
  const rows=Array.from({length:16},(_,i)=>({addr:(memoryPage+i)&0xffff,value:memory[(memoryPage+i)&0xffff]}));
  const hexKeys=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"];
  const controlKeys=["RESET","M SET","NEXT","PREV","EXAM MEM","EXAM REG","IN BYTE","OUT BYTE","SINGLE STEP","EXEC","GO","BLK MOVE"];
  const memoryDump=useMemo(()=>rows.map(r=>`${H(r.addr,4)}: ${H(r.value)}`).join("\n"),[rows]);

  return <div className="space-y-5">
    <div className="overflow-hidden rounded-2xl bg-[#0c1b29] text-white shadow-xl">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div><p className="text-[10px] font-black uppercase tracking-[.22em] text-cyan-300">EduLabX · MPMC · hardware learning model</p><h2 className="mt-1 text-xl font-black sm:text-2xl">GSAS-85A Virtual Trainer</h2><p className="mt-1 text-xs text-slate-300">8085 trainer workflow · hexadecimal keypad · memory monitor · CPU execution</p></div>
        <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-[10px] font-bold text-emerald-200">SOFTWARE TRAINER MODEL</span>
      </div>
      <div className="grid gap-4 p-4 lg:grid-cols-[1.05fr_.95fr]">
        <div className="rounded-xl border border-emerald-900 bg-[#07553d] p-3 shadow-inner">
          <div className="flex items-center justify-between"><span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">Six-digit seven-segment display</span><span className="h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_10px_#6ee7b7]"/></div>
          <div className="mt-3 rounded-lg border border-black/50 bg-[#07110e] px-3 py-4 text-center shadow-inner">
            <div className="font-mono text-3xl font-black tracking-[.2em] text-red-400 drop-shadow-[0_0_8px_rgba(248,113,113,.65)] sm:text-5xl">{display}</div>
            <p className="mt-2 text-[9px] font-bold uppercase tracking-widest text-emerald-200/70">ADDRESS (4 HEX DIGITS) · DATA / STATUS (2 DIGITS)</p>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-2">
            {hexKeys.map(k=><Key key={k} label={k} onClick={()=>appendKey(k)}/>)}
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2">
            {controlKeys.map(k=><Key key={k} label={k} accent={["RESET","EXEC","GO"].includes(k)} onClick={()=>pressButton(k)}/>)}
          </div>
        </div>
        <div className="space-y-3">
          <div className="rounded-xl border border-slate-700 bg-[#13283a] p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Trainer status</p>
            <p className="mt-2 min-h-12 text-sm leading-6 text-white">{status}</p>
            <p className="mt-3 border-t border-white/10 pt-3 text-[10px] text-slate-400">Last key: {lastAction}</p>
          </div>
          <div className="rounded-xl border border-slate-700 bg-[#13283a] p-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-300">Quick program loader</p>
            <p className="mt-1 text-xs leading-5 text-slate-300">Load a practical program into simulated RAM. The same keypad and CPU engine can then examine and execute its bytes.</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              <button onClick={()=>loadExample("addition")} className="rounded-lg bg-cyan-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-cyan-600">Load Exp 3 · Addition</button>
              <button onClick={()=>loadExample("multiplication")} className="rounded-lg bg-cyan-700 px-3 py-2.5 text-xs font-bold text-white hover:bg-cyan-600">Load Exp 4 · Multiplication</button>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-slate-700 bg-[#13283a] p-3"><p className="text-[9px] uppercase text-slate-400">PC</p><p className="mt-1 font-mono text-lg font-black text-white">{H(cpu.pc,4)}</p></div>
            <div className="rounded-lg border border-slate-700 bg-[#13283a] p-3"><p className="text-[9px] uppercase text-slate-400">Steps</p><p className="mt-1 font-mono text-lg font-black text-white">{cpu.steps}</p></div>
            <div className="rounded-lg border border-slate-700 bg-[#13283a] p-3"><p className="text-[9px] uppercase text-slate-400">CPU</p><p className="mt-1 text-sm font-black text-emerald-300">{cpu.halted?"HALT":"READY"}</p></div>
          </div>
        </div>
      </div>
    </div>

    <div className="flex flex-wrap gap-2">
      <button onClick={()=>setView("trainer")} className={`rounded-lg px-4 py-2 text-xs font-bold ${view==="trainer"?"bg-slate-900 text-white":"border border-slate-300 bg-white text-slate-700"}`}>Trainer & CPU</button>
      <button onClick={()=>setView("components")} className={`rounded-lg px-4 py-2 text-xs font-bold ${view==="components"?"bg-slate-900 text-white":"border border-slate-300 bg-white text-slate-700"}`}>Hardware components</button>
    </div>

    {view==="trainer" ? <div className="grid gap-4 xl:grid-cols-[1.05fr_.95fr]">
      <div className="space-y-4">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-4 py-3"><h3 className="text-sm font-black text-slate-900">CPU register bank</h3><p className="mt-1 text-xs text-slate-500">Live 8085 state generated by executed opcodes.</p></div>
          <div className="grid grid-cols-3 gap-2 p-4 sm:grid-cols-5">{registers.map(([name,val])=><div key={name} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><p className="text-[9px] font-bold uppercase text-slate-500">{name}</p><p className="mt-1 font-mono text-lg font-black text-slate-900">{H(val,name==="PC"||name==="SP"?4:2)}</p></div>)}</div>
          <div className="grid grid-cols-2 gap-2 px-4 pb-4 sm:grid-cols-4"><div className="rounded-lg bg-slate-100 p-3 text-xs"><b>HL</b><p className="mt-1 font-mono">{H(word(cpu.h,cpu.l),4)}</p></div><div className="rounded-lg bg-slate-100 p-3 text-xs"><b>BC</b><p className="mt-1 font-mono">{H(word(cpu.b,cpu.c),4)}</p></div><div className="rounded-lg bg-slate-100 p-3 text-xs"><b>Zero Z</b><p className="mt-1 font-mono">{cpu.z?"SET · 1":"CLEAR · 0"}</p></div><div className="rounded-lg bg-slate-100 p-3 text-xs"><b>Carry CY</b><p className="mt-1 font-mono">{cpu.cy?"SET · 1":"CLEAR · 0"}</p></div></div>
        </section>
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-4 py-3"><div><h3 className="text-sm font-black text-slate-900">RAM memory monitor</h3><p className="mt-1 text-xs text-slate-500">16 bytes from {H(memoryPage,4)} · program and result storage.</p></div><div className="flex gap-2"><button onClick={()=>{setMemoryPage((memoryPage+16)&0xffff);}} className="rounded-md border px-2 py-1 text-xs font-bold">Next page</button><button onClick={()=>setMemoryPage(0x8000)} className="rounded-md border px-2 py-1 text-xs font-bold">8000H</button></div></div>
          <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-4">{rows.map(r=><div key={r.addr} className={`rounded-md border p-2 font-mono ${r.addr===address?"border-cyan-500 bg-cyan-50":"border-slate-200 bg-slate-50"}`}><p className="text-[10px] text-slate-500">{H(r.addr,4)}</p><p className="text-sm font-black text-slate-900">{H(r.value)}</p></div>)}</div>
          <div className="flex flex-wrap items-center gap-2 px-4 pb-4"><button onClick={()=>setMemoryPage(address&0xfff0)} className="rounded-md bg-slate-900 px-3 py-2 text-xs font-bold text-white">Show current address</button><button onClick={()=>{const text=memoryDump;navigator.clipboard?.writeText(text);setStatus("Visible RAM page copied to clipboard.");}} className="rounded-md border px-3 py-2 text-xs font-bold">Copy memory page</button><button onClick={()=>{setMemory(Array(65536).fill(0));setStatus("All simulated RAM cleared.");}} className="rounded-md border border-rose-200 px-3 py-2 text-xs font-bold text-rose-700">Clear RAM</button></div>
        </section>
      </div>
      <div className="space-y-4">
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-4 py-3"><h3 className="text-sm font-black text-slate-900">CPU data path & execution log</h3><p className="mt-1 text-xs text-slate-500">Current execution history. Each entry is decoded from the opcode in RAM.</p></div><div className="max-h-[330px] space-y-2 overflow-auto p-4">{log.length?log.map((entry,i)=><div key={`${entry.address}-${i}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3"><div className="flex items-center justify-between gap-2"><span className="font-mono text-xs font-black text-cyan-900">{H(entry.address,4)} · {H(entry.opcode)}</span><span className="font-mono text-xs font-bold text-slate-800">{entry.text}</span></div><p className="mt-1 text-xs leading-5 text-slate-600">{entry.detail}</p></div>):<p className="text-sm text-slate-500">No instructions executed yet. Load a practical or enter opcode bytes using M SET.</p>}</div></section>
        <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"><h3 className="text-sm font-black text-slate-900">How to operate this virtual trainer</h3><ol className="mt-3 list-decimal space-y-2 pl-5 text-xs leading-5 text-slate-600"><li>Press <b>M SET</b>, enter four address digits, then press <b>NEXT</b>.</li><li>Enter each two-digit opcode/operand byte and press <b>NEXT</b> to store it and advance.</li><li>Press <b>RESET</b> to reset CPU (RAM is preserved).</li><li>Use <b>EXAM MEM</b> to inspect bytes, or <b>EXAM REG</b> to cycle registers.</li><li>Press <b>GO</b> to run from the current program counter, or <b>SINGLE STEP</b> to execute one instruction.</li></ol><p className="mt-3 rounded-lg bg-amber-50 p-3 text-xs leading-5 text-amber-900">This is an educational software model of the GSAS-85A workflow. It does not electrically emulate the board's ICs, keypad matrix or display driver circuitry. The supported instruction set is listed by the experiment programs and will expand in later phases.</p></section>
      </div>
    </div> : <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{componentInfo.map(([name,role,desc],i)=><button key={name} onClick={()=>setSelected(i)} className={`rounded-xl border p-4 text-left ${selected===i?"border-cyan-500 bg-cyan-50 ring-2 ring-cyan-100":"border-slate-200 bg-white hover:border-cyan-400"}`}><span className="text-[10px] font-black uppercase tracking-widest text-cyan-800">Component {String(i+1).padStart(2,"0")}</span><p className="mt-1 font-bold text-slate-900">{name}</p><p className="mt-1 text-xs text-slate-500">{role}</p><p className="mt-3 text-xs leading-5 text-slate-600">{desc}</p></button>)}</div>}
  </div>;
}
