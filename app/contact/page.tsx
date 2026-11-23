import PageHeader from "@/components/PageHeader";

export default function ContactUs() {
  return (
    <>
      <PageHeader
        title="Contact"
        breadcrumb="Contact"
        description="For questions about the EduLabX student project or its learning resources, use the appropriate college or department contact channels."
      />
      <main className="mx-auto max-w-[1200px] px-6 py-12 md:px-12 md:py-16">
        <div className="grid overflow-hidden border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="p-8 text-slate-700 md:p-12">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-cyan-800">Academic contact</p>
            <h2 className="mt-3 text-2xl font-semibold text-slate-950">Guru Nanak Dev Engineering College</h2>
            <p className="mt-4 text-sm leading-7">
              Gill Park, Gill Road, Ludhiana, Punjab 141006, India.
            </p>
            <div className="mt-8 border-t border-slate-100 pt-6">
              <h3 className="font-semibold text-slate-900">Electronics & Communication Engineering</h3>
              <p className="mt-2 text-sm">Email: <a href="mailto:ece@gndec.ac.in" className="text-cyan-800 hover:underline">ece@gndec.ac.in</a></p>
              <p className="mt-1 text-sm">Phone: +91-0161-5064501</p>
            </div>
            <p className="mt-8 text-xs leading-6 text-slate-500">
              EduLabX is a student-led project concept. These are college contact details,
              not a claim that the college has formally endorsed or operates the platform.
            </p>
            <a href="https://gndec.ac.in/" target="_blank" rel="noopener noreferrer"
              className="mt-6 inline-flex bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-800">
              Visit GNDEC website ↗
            </a>
          </div>
          <div className="min-h-[360px] bg-slate-100">
            <iframe
              src="https://maps.google.com/maps?q=Guru%20Nanak%20Dev%20Engineering%20College,%20Ludhiana&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%" height="100%" style={{ border: 0, minHeight: 360 }}
              loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              title="Guru Nanak Dev Engineering College location"
            />
          </div>
        </div>
      </main>
    </>
  );
}
