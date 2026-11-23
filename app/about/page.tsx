import Link from "next/link";

const principles = [
  {
    number: "01",
    title: "Connect theory with practice",
    description: "Bring subject concepts, experiment procedures and interactive tools together so learners can move from reading to testing.",
  },
  {
    number: "02",
    title: "Make experimentation accessible",
    description: "Provide structured learning activities that students can revisit, explore and use to prepare for laboratory sessions.",
  },
  {
    number: "03",
    title: "Support evidence-based learning",
    description: "Encourage learners to record observations, compare expected and measured behaviour, and explain their conclusions.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fa]">
      <section className="bg-[#102638] px-6 pb-16 pt-20 text-white md:px-12 md:pb-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-300">About the platform</p>
          <div className="mt-5 grid gap-8 md:grid-cols-[1fr_0.8fr] md:items-end">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Learning engineering by exploring how it works.</h1>
            <p className="text-base leading-8 text-slate-300">
              EduLabX is a proposed engineering learning and simulation platform that
              brings subject resources, guided practical work and interactive tools
              into one organised experience.
            </p>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-[1200px] px-6 py-14 md:px-12 md:py-20">
        <section className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">Our purpose</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">A practical companion for engineering education.</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              Engineering is learned through a combination of concepts, calculations,
              design decisions and experiments. EduLabX is being developed to help
              organise these parts of the learning process.
            </p>
            <p>
              The platform brings together department-based subject catalogues,
              experiment guidance and a connection to CircuitWeb, an independently
              developed browser-based circuit design and simulation project.
            </p>
            <p>
              Its initial focus is on electronics and communication engineering,
              with a structure that can accommodate additional departments and
              practical subjects as verified content becomes available.
            </p>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {principles.map((item) => (
            <article key={item.number} className="border border-slate-200 bg-white p-7 shadow-sm">
              <p className="text-sm font-bold tracking-[0.18em] text-cyan-700">{item.number}</p>
              <h3 className="mt-5 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">{item.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-16 border border-slate-200 bg-white p-8 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">Development status</p>
          <h2 className="mt-3 text-2xl font-semibold text-slate-950">A project under active development</h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-600">
            EduLabX is a student-led project concept. Any formal partnership,
            institutional endorsement, use of college branding or external
            publication will be undertaken only with the relevant approvals.
            EduLabX is not the official Virtual Labs initiative of the Ministry
            of Education and is not affiliated with that programme.
          </p>
          <Link href="/labs" className="mt-7 inline-flex bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-cyan-800">
            Explore available subjects →
          </Link>
        </section>
      </main>
    </div>
  );
}
