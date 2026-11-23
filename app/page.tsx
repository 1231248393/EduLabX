import Link from "next/link";
import Reveal from "@/components/Reveal";
import { allBranches } from "@/data/labsData";

const departmentVisuals: Record<string, { image: string; focus: string }> = {
  electronics: {
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=85&w=1000&auto=format&fit=crop",
    focus: "Circuits, communication, embedded systems and signal processing",
  },
  "computer-science": {
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=85&w=1000&auto=format&fit=crop",
    focus: "Programming, data, networks and intelligent systems",
  },
  mechanical: {
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=85&w=1000&auto=format&fit=crop",
    focus: "Machines, thermal systems, fluid mechanics and robotics",
  },
  electrical: {
    image: "https://images.unsplash.com/photo-1558449028-b53a39d100fc?q=85&w=1000&auto=format&fit=crop",
    focus: "Electrical machines, power systems and control",
  },
  civil: {
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?q=85&w=1000&auto=format&fit=crop",
    focus: "Structures, surveying and environmental systems",
  },
  chemical: {
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=85&w=1000&auto=format&fit=crop",
    focus: "Process engineering, reaction systems and mass transfer",
  },
};

const totalLabs = allBranches.reduce((sum, branch) => sum + branch.labs.length, 0);

export default function Home() {
  return (
    <div className="bg-[#f7f8fa] text-slate-900">
      <section className="edulabx-hero relative isolate flex min-h-[760px] items-end overflow-hidden bg-[#102638] pt-32 md:min-h-[820px]">
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-20 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=90&w=2200&auto=format&fit=crop')",
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-[#071827]/90 via-[#071827]/55 to-[#071827]/15" />
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-[#071827]/65 via-transparent to-[#071827]/15" />

        <div className="mx-auto grid w-full max-w-[1440px] grid-cols-1 items-end gap-12 px-6 pb-20 pt-20 md:px-12 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-16 lg:pb-28">
          <div className="max-w-3xl">
            <p className="mb-6 inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.24em] text-cyan-200">
              <span className="h-px w-10 bg-cyan-300" />
              Engineering learning · Interactive exploration
            </p>
            <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-6xl lg:text-7xl">
              Build ideas.
              <br />
              Test discoveries.
              <br />
              <span className="text-cyan-200">Learn by doing.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-slate-100 sm:text-lg">
              Explore engineering subjects, work through practical experiments and
              investigate how systems behave with interactive learning tools.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link
                href="/labs"
                className="inline-flex items-center justify-center rounded-sm bg-cyan-500 px-7 py-3.5 text-sm font-semibold text-slate-950 shadow-lg transition hover:bg-cyan-300"
              >
                Explore learning labs <span className="ml-3" aria-hidden="true">→</span>
              </Link>
              <Link
                href="/about"
                className="inline-flex items-center justify-center rounded-sm border border-white/60 bg-white/10 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
              >
                Discover EduLabX
              </Link>
            </div>
          </div>

          <div className="hidden border border-white/20 bg-[#0b1d2b]/65 p-6 text-white shadow-2xl backdrop-blur-md lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">Explore the platform</p>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <p className="text-4xl font-semibold">{allBranches.length}</p>
                <p className="mt-1 text-xs text-slate-300">Departments listed</p>
              </div>
              <div>
                <p className="text-4xl font-semibold">{totalLabs}</p>
                <p className="mt-1 text-xs text-slate-300">Subject areas listed</p>
              </div>
            </div>
            <div className="mt-6 border-t border-white/15 pt-5">
              <p className="text-sm leading-6 text-slate-200">
                Start with a subject, explore its practical work and continue into
                the relevant simulation or learning activity.
              </p>
              <Link href="/labs" className="mt-4 inline-flex text-sm font-semibold text-cyan-200 hover:text-white">
                Browse all subjects <span className="ml-2">↗</span>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-16 lg:py-24">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-700">Find your area</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
              Explore engineering disciplines
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
              Browse the departments currently represented in the EduLabX catalogue.
              Choose a discipline to see its subjects and available practical resources.
            </p>
          </div>
          <Link href="/labs" className="text-sm font-semibold text-cyan-800 hover:text-cyan-600">
            View all subjects <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {allBranches.map((branch, index) => {
            const visual = departmentVisuals[branch.slug];
            return (
              <Reveal key={branch.slug} delay={index * 60}>
                <Link
                  href={`/branches/${branch.slug}`}
                  className="group flex h-full flex-col overflow-hidden border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-slate-200">
                    {visual && (
                      <img
                        src={visual.image}
                        alt=""
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                    <span className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                      Department
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <h3 className="text-xl font-semibold leading-snug text-slate-900 group-hover:text-cyan-800">
                      {branch.title}
                    </h3>
                    <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">
                      {visual?.focus ?? "Explore the subjects and practical resources available in this department."}
                    </p>
                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                      <span className="text-xs font-medium text-slate-500">
                        {branch.labs.length} subject areas
                      </span>
                      <span className="text-sm font-semibold text-cyan-800 group-hover:translate-x-1 transition">
                        Explore department →
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-[#102638] text-white">
        <div className="mx-auto grid max-w-[1440px] gap-10 px-6 py-16 md:px-12 lg:grid-cols-[1fr_1fr] lg:px-16 lg:py-20">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-cyan-300">From concepts to practice</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
              A connected space for engineering learning.
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="border-l-2 border-cyan-400 pl-5">
              <h3 className="font-semibold">Guided practicals</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Follow experiment aims, concepts, procedures and observations in one place.
              </p>
            </div>
            <div className="border-l-2 border-cyan-400 pl-5">
              <h3 className="font-semibold">Interactive simulation</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Open CircuitWeb for circuit construction and instrument-based learning.
              </p>
              <Link href="/labs" className="mt-3 inline-block text-sm font-semibold text-cyan-200 hover:text-white">
                Find a simulation subject →
              </Link>
            </div>
            <div className="border-l-2 border-cyan-400 pl-5">
              <h3 className="font-semibold">Learning resources</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                Organise subject material and practical references alongside each topic.
              </p>
            </div>
            <div className="border-l-2 border-cyan-400 pl-5">
              <h3 className="font-semibold">Student progress</h3>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                A foundation for recording observations, results and completed practical work.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
