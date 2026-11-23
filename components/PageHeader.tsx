import Link from "next/link";

interface PageHeaderProps {
  title: string;
  breadcrumb: string;
  description?: string;
}

export default function PageHeader({ title, breadcrumb, description }: PageHeaderProps) {
  return (
    <section className="bg-[#102638] pb-14 pt-14 text-white md:pb-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-12">
        <div className="mb-8 flex items-center gap-2 text-xs text-slate-300">
          <Link href="/" className="transition hover:text-cyan-200">Home</Link>
          <span aria-hidden="true">/</span>
          <span className="text-white">{breadcrumb}</span>
        </div>
        <div className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-end">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl md:text-5xl">{title}</h1>
          {description && <p className="max-w-2xl text-sm leading-7 text-slate-300 md:text-base">{description}</p>}
        </div>
      </div>
    </section>
  );
}
