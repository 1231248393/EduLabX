"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/labs", label: "Explore labs" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const query = searchQuery.trim();
    router.push(query ? `/labs?search=${encodeURIComponent(query)}` : "/labs");
    setMobileOpen(false);
  }

  return (
    <header className={`z-50 w-full ${isHome ? "absolute left-0 top-0" : "sticky top-0"} ${
      isHome
        ? "border-b border-white/15 bg-slate-950/25 text-white backdrop-blur-md"
        : "border-b border-slate-200 bg-white/95 text-slate-900 shadow-sm backdrop-blur"
    }`}>
      <div className="mx-auto flex min-h-[82px] max-w-[1440px] items-center justify-between gap-5 px-5 md:px-10 lg:px-16">
        <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="EduLabX home">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border ${
            isHome ? "border-cyan-200/70 bg-white/10" : "border-cyan-800/20 bg-cyan-50"
          }`}>
            <svg viewBox="0 0 32 32" className={`h-7 w-7 ${isHome ? "text-cyan-200" : "text-cyan-800"}`} fill="none" aria-hidden="true">
              <path d="M6 7h20v18H6z" stroke="currentColor" strokeWidth="1.7"/>
              <path d="M10 12h12M10 16h7M10 20h12M22 16l3 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"/>
              <circle cx="22" cy="16" r="2" fill="currentColor"/>
            </svg>
          </span>
          <span className="min-w-0">
            <span className={`block text-xl font-bold tracking-[0.16em] ${isHome ? "text-white" : "text-slate-950"}`}>EduLabX</span>
            <span className={`hidden text-[9px] font-semibold uppercase tracking-[0.16em] sm:block ${isHome ? "text-slate-200" : "text-slate-500"}`}>
              Engineering learning platform
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-xs font-semibold uppercase tracking-[0.12em] transition ${
                pathname === item.href
                  ? isHome ? "text-cyan-200" : "text-cyan-800"
                  : isHome ? "text-white/90 hover:text-cyan-200" : "text-slate-600 hover:text-cyan-800"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <form onSubmit={handleSearch} className={`flex w-[205px] items-center border ${
            isHome ? "border-white/30 bg-white/10" : "border-slate-200 bg-slate-50"
          }`}>
            <input
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search subjects"
              aria-label="Search subjects"
              className={`min-w-0 flex-1 bg-transparent px-3 py-2.5 text-xs outline-none ${
                isHome ? "text-white placeholder:text-white/60" : "text-slate-900 placeholder:text-slate-400"
              }`}
            />
            <button type="submit" className={`px-3 ${isHome ? "text-white/80" : "text-slate-500"}`} aria-label="Submit search">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>
              </svg>
            </button>
          </form>
          <Link href="/labs" className={`hidden xl:inline-flex px-4 py-3 text-xs font-bold uppercase tracking-wider transition ${
            isHome ? "bg-cyan-400 text-slate-950 hover:bg-cyan-200" : "bg-slate-900 text-white hover:bg-cyan-800"
          }`}>
            Student workspace
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          className={`inline-flex h-10 w-10 items-center justify-center border lg:hidden ${
            isHome ? "border-white/40 text-white" : "border-slate-300 text-slate-800"
          }`}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="m6 6 12 12M18 6 6 18"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className={`border-t px-5 pb-5 pt-3 lg:hidden ${
          isHome ? "border-white/15 bg-slate-950/95" : "border-slate-200 bg-white"
        }`}>
          <nav className="flex flex-col" aria-label="Mobile navigation">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}
                className={`border-b py-3 text-sm font-semibold ${
                  isHome ? "border-white/10 text-white" : "border-slate-100 text-slate-800"
                }`}>
                {item.label}
              </Link>
            ))}
          </nav>
          <form onSubmit={handleSearch} className={`mt-4 flex border ${
            isHome ? "border-white/30" : "border-slate-200"
          }`}>
            <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search subjects" aria-label="Search subjects"
              className={`min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none ${
                isHome ? "text-white placeholder:text-white/60" : "text-slate-900"
              }`}/>
            <button type="submit" className={`px-4 text-sm font-semibold ${isHome ? "text-cyan-200" : "text-cyan-800"}`}>Search</button>
          </form>
        </div>
      )}
    </header>
  );
}
