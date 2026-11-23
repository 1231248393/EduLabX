import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#091827] px-6 py-12 text-slate-300">
      <div className="mx-auto grid max-w-[1200px] gap-8 md:grid-cols-3">
        <div>
          <Link href="/" className="text-xl font-bold tracking-[0.16em] text-white">EduLabX</Link>
          <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
            A student-led engineering learning and simulation project.
          </p>
        </div>
        <div>
          <h2 className="font-semibold text-white">Explore</h2>
          <div className="mt-3 flex flex-col gap-2 text-sm text-slate-400">
            <Link href="/labs" className="hover:text-cyan-200">Learning labs</Link>
            <Link href="/about" className="hover:text-cyan-200">About EduLabX</Link>
            <Link href="/contact" className="hover:text-cyan-200">Contact</Link>
          </div>
        </div>
        <div>
          <h2 className="font-semibold text-white">Academic context</h2>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Proposed academic collaboration with Guru Nanak Dev Engineering College,
            subject to institutional approval.
          </p>
        </div>
      </div>
      <div className="mx-auto mt-8 max-w-[1200px] border-t border-white/10 pt-5 text-xs text-slate-500">
        © {new Date().getFullYear()} EduLabX. Project content and institutional attribution subject to review.
      </div>
    </footer>
  );
}
