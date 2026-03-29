import Link from "next/link";

export default function CategoryCard({
  href,
  label,
  description,
  badge,
}: {
  href: string;
  label: string;
  description?: string;
  badge?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative overflow-hidden rounded-3xl border border-neutral-200/70 bg-white/50 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs tracking-widest uppercase text-neutral-600">
              Collection
            </p>
            <h3 className="mt-2 text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900">
              {label}
            </h3>
          </div>
          {badge ? (
            <span className="inline-flex items-center rounded-full bg-[#FFD6E0]/80 border border-neutral-200 px-3 py-1 text-xs font-semibold text-neutral-900">
              {badge}
            </span>
          ) : null}
        </div>

        {description ? (
          <p className="mt-3 text-sm text-neutral-600 leading-relaxed">
            {description}
          </p>
        ) : null}

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-neutral-900">
          Explore
          <span className="transition-transform group-hover:translate-x-1">
            →
          </span>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#FFD6E0]/40 via-transparent to-[#F7B3C2]/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

