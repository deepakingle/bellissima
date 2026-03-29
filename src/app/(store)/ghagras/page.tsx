import Container from "@/components/layout/Container";
import ProductCard from "@/components/catalog/ProductCard";
import SectionHeading from "@/components/layout/SectionHeading";
import type { ProductCategory } from "@/server/db";
import { getProductsByCategory } from "@/server/db";

const category: ProductCategory = "ghagras";

export default function GhagrasPage() {
  const products = getProductsByCategory(category, 100);

  return (
    <div>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 sm:p-8 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-neutral-600">
              Collection
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
              Ghagras
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-700 max-w-2xl leading-relaxed">
              Festive flair and elegant movement—browse ghagras with premium
              fabric details.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <SectionHeading
            eyebrow="Browse"
            title="Ghagras"
            subtitle={`${products.length} items available.`}
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {products.length ? (
              products.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6">
                  <p className="text-neutral-900 font-semibold">
                    No ghagras yet.
                  </p>
                  <p className="mt-2 text-sm text-neutral-600">
                    Add products from the admin dashboard to populate this page.
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

