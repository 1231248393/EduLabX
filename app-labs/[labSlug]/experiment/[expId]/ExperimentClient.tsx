"use client";

import React, { useState } from "react";
import Link from "next/link";
import AMDemodulationSimulation from "./AMDemodulationSimulation";
import DSBAMCircuitWorkbench from "./DSBAMCircuitWorkbench";
import ExperimentSimulation from "./ExperimentSimulation";
import MPMCSimulator from "./MPMCSimulator";
import type { PracticalData } from "@/data/practicalsData";

type Props = { data: PracticalData; experimentId: string; labSlug: string };
type SectionId = "aim" | "theory" | "procedure" | "program" | "simulation";

const sections: { id: SectionId; label: string }[] = [
  { id: "aim", label: "Aim" },
  { id: "theory", label: "Theory" },
  { id: "procedure", label: "Procedure" },
  { id: "program", label: "Program / Opcode Table" },
  { id: "simulation", label: "Simulation" },
];


function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      <h1 className="mb-6 border-b border-gray-200 pb-4 text-2xl font-bold text-gray-800 md:text-3xl">{title}</h1>
      {children}
    </section>
  );
}

function MissingContent({ label }: { label: string }) {
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <strong>{label} needs source verification.</strong>
      <p className="mt-1">This section has not been included in the practical notes supplied for this experiment.</p>
    </div>
  );
}

function TextList({ title, items, ordered = false }: { title: string; items?: string[] | null; ordered?: boolean }) {
  const List = ordered ? "ol" : "ul";
  if (!items?.length) return <div className="mt-6"><h2 className="mb-3 text-lg font-bold text-slate-800">{title}</h2><MissingContent label={title} /></div>;
  return (
    <div className="mt-6">
      <h2 className="mb-3 text-lg font-bold text-slate-800">{title}</h2>
      <List className={`${ordered ? "list-decimal" : "list-disc"} space-y-3 pl-6 leading-7 text-gray-700`}>
        {items.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
      </List>
    </div>
  );
}

function DiagramGallery({ items, heading }: { items?: { src: string; title: string; caption?: string }[]; heading: string }) {
  if (!items?.length) return <div className="mt-8"><h2 className="mb-3 text-xl font-bold text-slate-800">{heading}</h2><MissingContent label={heading} /></div>;
  return (
    <section className="mt-9">
      <h2 className="mb-4 border-b border-slate-200 pb-2 text-xl font-bold text-slate-800">{heading}</h2>
      <div className="space-y-5">
        {items.map((item) => (
          <figure key={item.src} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-4 py-3">
              <h3 className="font-semibold text-slate-800">{item.title}</h3>
              <a href={item.src} target="_blank" rel="noreferrer" className="shrink-0 text-sm font-semibold text-cyan-800 underline underline-offset-4">Enlarge diagram</a>
            </div>
            <div className="flex min-h-48 items-center justify-center bg-white p-4 md:p-7">
              <img src={item.src} alt={item.title} loading="lazy" className="block h-auto max-h-[680px] w-full object-contain" />
            </div>
            {item.caption && <figcaption className="border-t border-slate-100 px-4 py-3 text-sm leading-6 text-slate-600">{item.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}

export default function ExperimentClient({ data, experimentId, labSlug }: Props) {
  const [activeSection, setActiveSection] = useState<SectionId>("aim");
  const isAmDemodulation = experimentId === "am-demodulation";
  const isDsbAmGeneration = experimentId === "am-generation-dsb";
  const isMpmc = experimentId.startsWith("mpmc-");
  const hasSimulation = Boolean(data.simulation) || isAmDemodulation || isMpmc;
  const visibleSections = sections.filter(({ id }) => id !== "program" || Boolean(data.programSections?.length)).filter(({ id }) => id !== "simulation" || hasSimulation);

  const renderContent = () => {
    switch (activeSection) {
      case "aim":
        return (
          <Panel title="Aim of Experiment">
            <p className="whitespace-pre-wrap text-lg leading-8 text-gray-700">{data.aim || "Aim details are not available in the supplied practical notes."}</p>
          </Panel>
        );
      case "theory":
        return (
          <Panel title="Theory">
            {data.apparatus?.length ? (
              <section className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h2 className="mb-3 text-lg font-bold text-slate-800">Apparatus Required</h2>
                <ul className="list-disc space-y-2 pl-6 leading-7 text-gray-700">
                  {data.apparatus.map((item, index) => <li key={`${index}-${item}`}>{item}</li>)}
                </ul>
              </section>
            ) : null}
            <section className="rounded-lg border border-slate-200 bg-white p-5 md:p-6">
              <h2 className="mb-4 text-xl font-bold text-slate-800">Theory and Working Principle</h2>
              <div className="max-w-none whitespace-pre-wrap text-[16px] leading-8 text-slate-700">{data.theory || "Theory details are not available in the supplied practical notes."}</div>
            </section>
            {data.references?.length ? (
              <section className="mt-8 rounded-xl border border-slate-200 bg-slate-50 p-5">
                <h2 className="mb-3 text-lg font-bold text-slate-800">Further Reading / Technical References</h2>
                <ul className="list-disc space-y-2 pl-5 text-sm leading-6 text-[#0b5c9e]">
                  {data.references.map((reference) => <li key={reference.url}><a href={reference.url} target="_blank" rel="noreferrer" className="underline underline-offset-4">{reference.label}</a></li>)}
                </ul>
              </section>
            ) : null}
            {data.diagrams?.length ? (
              <DiagramGallery
                items={data.diagrams}
                heading={experimentId === "mpmc-16bit-add-sub" || experimentId === "mpmc-8bit-multiplication" ? "Program Flowcharts" : "Architecture Diagram / Trainer Hardware"}
              />
            ) : null}
          </Panel>
        );
      case "program":
        return (
          <Panel title="Assembly Program and Opcode Table">
            <p className="mb-6 leading-7 text-gray-700">The following assembly listings are presented as readable program and opcode tables. Addresses and opcode bytes are shown in hexadecimal.</p>
            <div className="space-y-8">
              {data.programSections?.map((program, programIndex) => (
                <section key={`${programIndex}-${program.title}`} className="overflow-hidden rounded-xl border border-slate-200">
                  <div className="border-b border-slate-200 bg-slate-50 p-4">
                    <h2 className="text-lg font-bold text-slate-900">{program.title}</h2>
                    {program.description && <p className="mt-1 text-sm leading-6 text-slate-600">{program.description}</p>}
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] border-collapse text-left text-sm">
                      <thead className="bg-slate-100 text-slate-800">
                        <tr>
                          <th className="border-b border-r border-slate-200 px-3 py-3">Memory location</th>
                          <th className="border-b border-r border-slate-200 px-3 py-3">Mnemonics</th>
                          <th className="border-b border-r border-slate-200 px-3 py-3">Hex code</th>
                          <th className="border-b border-slate-200 px-3 py-3">Comments</th>
                        </tr>
                      </thead>
                      <tbody>
                        {program.rows.map((row, rowIndex) => (
                          <tr key={`${programIndex}-${rowIndex}`} className="odd:bg-white even:bg-slate-50">
                            {row.map((cell, cellIndex) => <td key={cellIndex} className="border-b border-r border-slate-100 px-3 py-2.5 align-top font-mono text-slate-700 last:border-r-0">{cell}</td>)}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          </Panel>
        );
      case "procedure":
        return (
          <Panel title="Procedure">
            {data.procedure?.length ? <TextList title="Procedure" items={data.procedure} ordered /> : null}
            {data.procedureGroups?.map((group, groupIndex) => (
              <section key={`procedure-group-${groupIndex}`} className="mt-6 rounded-xl border border-slate-200 bg-white p-5 md:p-6">
                <h2 className="mb-4 text-lg font-bold text-slate-900">{group.title}</h2>
                <ol className="list-decimal space-y-3 pl-6 text-[15px] leading-7 text-slate-700">
                  {group.steps.map((step, stepIndex) => <li key={`procedure-step-${groupIndex}-${stepIndex}`}>{step}</li>)}
                </ol>
              </section>
            ))}
            {!data.procedure?.length && !data.procedureGroups?.length ? <MissingContent label="Experiment procedure" /> : null}
            <TextList title="Precautions" items={data.precautions} />
            {data.result && <section className="mt-7"><h2 className="mb-2 text-lg font-bold text-slate-800">Result</h2><p className="leading-7 text-gray-700">{data.result}</p></section>}
          </Panel>
        );
      case "simulation":
        return (
          <section>
            <div className="mb-5">
              <h1 className="text-2xl font-bold text-gray-800 md:text-3xl">{data.title} — Simulation</h1>
              <p className="mt-2 max-w-4xl text-sm leading-6 text-gray-600">
                {isAmDemodulation
                  ? "Adjust the AM source, detector capacitor and load selection. The CRO traces are produced by the existing diode and RC detector model."
                  : "Educational mathematical model. Controls update the displayed values and waveforms; this is not a transistor-level circuit solver."}
              </p>
            </div>
            {isMpmc
              ? <MPMCSimulator experimentId={experimentId as "mpmc-microprocessor-intro" | "mpmc-microcontroller-intro" | "mpmc-16bit-add-sub" | "mpmc-8bit-multiplication" | "mpmc-8051-add-sub-8bit" | "mpmc-8051-mul-div-8bit" | "mpmc-8051-logical-8bit" | "mpmc-8051-add-sub-16bit" | "mpmc-8051-mask-nibble" | "mpmc-8051-smallest-three" | "mpmc-8051-sort-ascending" | "mpmc-8051-led-interfacing" | "mpmc-8051-lcd-interfacing"} />
              : isAmDemodulation
              ? <AMDemodulationSimulation />
              : isDsbAmGeneration
                ? <DSBAMCircuitWorkbench />
                : hasSimulation
                ? <ExperimentSimulation experiment={data.simulation ?? ""} controls />
                : <MissingContent label="Experiment-specific simulation" />}
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-28 md:flex">
      <aside className="w-full shrink-0 border-r border-gray-200 bg-white shadow-sm md:sticky md:top-28 md:h-[calc(100vh-7rem)] md:w-72 md:overflow-y-auto">
        <div className="bg-[#0b5c9e] p-4 text-white">
          <Link href={`/labs/${labSlug}`} className="text-xs text-blue-100 hover:text-white">&larr; {labSlug === "microprocessors-microcontrollers" ? "Back to MPMC experiments" : "Back to ADC experiments"}</Link>
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-blue-100">{data.printedNumber ?? "Practical experiment"}</p>
          <h2 className="mt-1 text-xl font-bold">{data.title}</h2>
        </div>
        <nav aria-label="Practical sections" className="grid grid-cols-2 py-2 md:grid-cols-1">
          {visibleSections.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveSection(id)}
              aria-current={activeSection === id ? "page" : undefined}
              className={`border-l-4 px-4 py-4 text-left text-sm font-semibold transition-colors ${activeSection === id ? "border-[#0b5c9e] bg-blue-50 text-[#0b5c9e]" : "border-transparent text-gray-600 hover:bg-gray-50"}`}
            >
              {label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-10">{renderContent()}</main>
    </div>
  );
}
