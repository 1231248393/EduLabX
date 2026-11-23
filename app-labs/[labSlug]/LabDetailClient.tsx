"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { allBranches } from "@/data/labsData";
import { adcExperiments } from "@/data/adcExperiments";
import { mpmcExperiments } from "@/data/mpmcExperiments";

type LabInfo = { slug: string; title: string; shortName?: string; desc?: string; overview?: string; objectives?: string[] };

export default function LabDetailClient({ labSlug }: { labSlug: string }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [experimentSearch, setExperimentSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");

  let currentLab: LabInfo | null = null;
  let branchName = "";
  let branchSlug = "";

  for (const branch of allBranches) {
    const foundLab = branch.labs.find((lab) => lab.slug === labSlug);
    if (foundLab) {
      currentLab = foundLab as LabInfo;
      branchName = branch.title;
      branchSlug = branch.slug;
      break;
    }
  }

  const isAdcLab = labSlug === "analog-digital-communication";
  const isMpmcLab = labSlug === "microprocessors-microcontrollers";
  const filteredExperiments = useMemo(() => adcExperiments.filter((experiment) => {
    const matchesText = `${experiment.title} ${experiment.description} ${experiment.category}`.toLowerCase().includes(experimentSearch.trim().toLowerCase());
    return matchesText && (categoryFilter === "All categories" || experiment.category === categoryFilter);
  }), [experimentSearch, categoryFilter]);

  if (!currentLab) return <div className="pt-48 text-center text-xl">Lab not found.</div>;

  const displayTitle = currentLab.shortName ? `${currentLab.shortName} - ${currentLab.title}` : currentLab.title;
  const hasPracticals = labSlug.includes("communication") || labSlug === "analog-digital-electronics-i" || isMpmcLab;

  return (
    <>
      <PageHeader title={displayTitle} breadcrumb={`Labs > ${branchName}`} description={currentLab.desc} />

      <main className="max-w-[1200px] mx-auto mt-12 px-8 pb-24 flex flex-col md:flex-row gap-10">
        
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white border border-gray-200 shadow-sm sticky top-28">
            <ul className="flex flex-col text-sm font-medium text-gray-700">
              <li className="border-b border-gray-100"><button onClick={() => setActiveTab("overview")} className={`w-full text-left block px-6 py-3 transition-colors border-l-4 ${activeTab === "overview" ? "bg-[#0b5c9e] text-white border-blue-900" : "border-transparent hover:bg-gray-50"}`}>Introduction / Overview</button></li>
              <li className="border-b border-gray-100"><button onClick={() => setActiveTab("objectives")} className={`w-full text-left block px-6 py-3 transition-colors border-l-4 ${activeTab === "objectives" ? "bg-[#0b5c9e] text-white border-blue-900" : "border-transparent hover:bg-gray-50"}`}>Objectives</button></li>
              <li className="border-b border-gray-100"><button onClick={() => setActiveTab("experiments")} className={`w-full text-left block px-6 py-3 transition-colors border-l-4 ${activeTab === "experiments" ? "bg-[#0b5c9e] text-white border-blue-900" : "border-transparent hover:bg-gray-50"}`}>List of Experiments</button></li>
            </ul>
            <div className="p-4 bg-gray-50 border-t border-gray-200">
              <Link href={`/branches/${branchSlug}`} className="text-sm text-[#0b5c9e] font-semibold hover:underline flex items-center gap-1">
                &larr; Back to Labs
              </Link>
            </div>
          </div>
        </aside>

        <div className="flex-1 bg-white border border-gray-200 shadow-sm p-8 md:p-12 min-h-[500px]">
          
          {activeTab === "overview" && (
             <div className="animate-fade-in">
               <h2 className="text-3xl font-serif text-[#0b5c9e] mb-6 border-b pb-2">Introduction</h2>
               <p className="text-gray-700 leading-relaxed text-justify">{currentLab.overview || "This virtual laboratory provides a comprehensive understanding of the core concepts."}</p>
             </div>
          )}

          {activeTab === "objectives" && (
            <div className="animate-fade-in">
              <h2 className="text-3xl font-serif text-[#0b5c9e] mb-6 border-b pb-2">Objectives</h2>
              <ul className="list-disc list-inside space-y-3 text-gray-700">
                {currentLab.objectives ? currentLab.objectives.map((obj: string, i: number) => <li key={i}>{obj}</li>) : <li>To provide practical knowledge.</li>}
              </ul>
            </div>
          )}

          {activeTab === "experiments" && (
            <div className="animate-fade-in">
              {isMpmcLab ? (
                <div className="grid gap-4">
                  {mpmcExperiments.map((experiment) => (
                    <article key={experiment.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0b5c9e]">{experiment.printedNumber}</span>
                            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{experiment.category}</span>
                          </div>
                          <h3 className="text-lg font-bold text-[#0b5c9e]">{experiment.title}</h3>
                          <p className="mt-1 text-sm leading-6 text-gray-600">{experiment.description}</p>
                        </div>
                        <Link href={`/labs/${labSlug}/experiment/${experiment.id}`} className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0b5c9e] px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-800">
                          Open Practical <span aria-hidden="true" className="ml-2">→</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              ) : isAdcLab ? (
                <>
                  <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
                    <label className="sr-only" htmlFor="adc-experiment-search">Search experiments</label>
                    <input
                      id="adc-experiment-search"
                      value={experimentSearch}
                      onChange={(event) => setExperimentSearch(event.target.value)}
                      placeholder="Search experiments"
                      className="rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-[#0b5c9e] focus:ring-2 focus:ring-blue-100"
                    />
                    <label className="sr-only" htmlFor="adc-category-filter">Filter by category</label>
                    <select
                      id="adc-category-filter"
                      value={categoryFilter}
                      onChange={(event) => setCategoryFilter(event.target.value)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-700 outline-none focus:border-[#0b5c9e]"
                    >
                      {["All categories", ...Array.from(new Set(adcExperiments.map((experiment) => experiment.category)))].map((category) => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid gap-4">
                    {filteredExperiments.map((experiment) => (
                      <article key={experiment.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-[#0b5c9e]">{experiment.printedNumber}</span>
                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">{experiment.category}</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#0b5c9e]">{experiment.title}</h3>
                            <p className="mt-1 text-sm leading-6 text-gray-600">{experiment.description}</p>
                          </div>
                          <Link href={`/labs/${labSlug}/experiment/${experiment.id}`} className="inline-flex shrink-0 items-center justify-center rounded-lg bg-[#0b5c9e] px-5 py-3 font-semibold text-white shadow-sm hover:bg-blue-800">
                            Open Experiment <span aria-hidden="true" className="ml-2">→</span>
                          </Link>
                        </div>
                      </article>
                    ))}
                    {filteredExperiments.length === 0 && <p className="rounded-lg border border-dashed border-gray-300 p-8 text-center text-gray-500">No experiments match your search.</p>}
                  </div>
                </>
              ) : hasPracticals ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-5 sm:flex sm:items-center sm:justify-between">
                  <div><h3 className="text-lg font-bold text-[#0b5c9e]">AM Demodulation</h3><p className="text-sm text-gray-600">Study envelope detection and observe the recovered waveform.</p></div>
                  <Link href={`/labs/${labSlug}/experiment/am-demodulation`} className="mt-4 inline-flex rounded-lg bg-[#0b5c9e] px-5 py-3 font-semibold text-white hover:bg-blue-800 sm:mt-0">Start Lab</Link>
                </div>
              ) : <p className="text-gray-500">Experiments for this lab are currently being uploaded.</p>}
            </div>
          )}

        </div>
      </main>
    </>
  );
}
