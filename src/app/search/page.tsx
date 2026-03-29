import Link from "next/link";

import Container from "@/components/layout/Container";
import ProductCard from "@/components/catalog/ProductCard";
import SectionHeading from "@/components/layout/SectionHeading";

import { searchProducts } from "@/server/db";

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const q = (searchParams.q ?? "").trim();
  const products = q ? searchProducts({ q, limit: 24 }) : [];

  return (
    <div>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 sm:p-8 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-neutral-600">
              Search
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
              {q ? `“${q}”` : "Find your fabric"}
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-700 max-w-2xl leading-relaxed">
              {q
                ? `Showing ${products.length} result${products.length === 1 ? "" : "s"} from our catalog.`
                : "Use the header search to discover sarees, blouses, lehengas, ghagras, and dupattas."}
            </p>

            <div className="mt-6">
              <Link
                href="/"
                className="inline-flex rounded-full bg-white/70 border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <SectionHeading
            eyebrow="Results"
            title={q ? "Matching products" : "Start searching"}
            subtitle={q ? "Browse the catalog below." : "Type a keyword to see results."}
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {q ? (
              products.length ? (
                products.map((p) => <ProductCard key={p.id} product={p} />)
              ) : (
                <div className="sm:col-span-2 lg:col-span-4">
                  <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6">
                    <p className="text-neutral-900 font-semibold">
                      No matches found.
                    </p>
                    <p className="mt-2 text-sm text-neutral-600">
                      Try a different keyword (e.g. fabric, title, or category
                      style).
                    </p>
                  </div>
                </div>
              )
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6">
                  <p className="text-neutral-900 font-semibold">
                    No query provided.
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Use the search bar in the header to find products.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </div>
  );
}

