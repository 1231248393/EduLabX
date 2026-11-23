import Link from "next/link";
import CopyrightYear from "./CopyrightYear";

export default function Footer() {
  return (
    <footer className="bg-[#091827] text-slate-300">
      <div className="mx-auto grid max-w-[1440px] gap-12 px-6 py-14 md:grid-cols-2 md:px-12 lg:grid-cols-[1.5fr_1fr_1fr_1.2fr] lg:px-16">
        <div>
          <Link href="/" className="inline-block text-2xl font-bold tracking-[0.16em] text-white">EduLabX</Link>
          <p className="mt-3 max-w-sm text-xs font-semibold uppercase tracking-[0.15em] text-cyan-300">
            Engineering learning & simulation
          </p>
          <p className="mt-5 max-w-md text-sm leading-7 text-slate-400">
            A student-led educational technology project exploring practical engineering,
            interactive experiments and circuit simulation.
          </p>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Proposed academic collaboration with Guru Nanak Dev Engineering College,
            Ludhiana. Institutional endorsement and branding are subject to college approval.
          </p>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Explore</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li><Link href="/" className="hover:text-cyan-200">Home</Link></li>
            <li><Link href="/labs" className="hover:text-cyan-200">All subjects</Link></li>
            <li><Link href="/about" className="hover:text-cyan-200">About EduLabX</Link></li>
            <li><Link href="/contact" className="hover:text-cyan-200">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">Learning areas</h2>
          <ul className="mt-5 space-y-3 text-sm text-slate-400">
            <li>Engineering departments</li>
            <li>Guided practicals</li>
            <li>Interactive simulation</li>
            <li>Learning resources</li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm font-bold text-white">College information</h2>
          <p className="mt-5 text-sm leading-6 text-slate-400">
            Guru Nanak Dev Engineering College<br />
            Gill Park, Gill Road<br />
            Ludhiana, Punjab 141006, India
          </p>
          <a href="https://gndec.ac.in/" target="_blank" rel="noopener noreferrer"
            className="mt-4 inline-block text-sm font-semibold text-cyan-300 hover:text-white">
            GNDEC official website ↗
          </a>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1440px] flex-col gap-3 px-6 py-5 text-xs text-slate-500 md:flex-row md:items-center md:justify-between md:px-12 lg:px-16">
          <p>© <CopyrightYear /> EduLabX. Project identity and content subject to ownership and institutional review.</p>
          <p>Built for engineering learning.</p>
        </div>
      </div>
    </footer>
  );
}
