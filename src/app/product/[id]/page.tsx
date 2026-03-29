import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import ProductCard from "@/components/catalog/ProductCard";
import { getLatestProducts, getProductById } from "@/server/db";

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) notFound();

  const product = getProductById(id);
  if (!product) notFound();

  const related = getLatestProducts(8).filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-4 sm:p-6 shadow-sm">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60 bg-white/40">
                  {product.imagePath ? (
                    <Image
                      src={`/${product.imagePath}`}
                      alt={product.title}
                      fill
                      priority
                      className="object-contain bg-white/50"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-500 text-sm">
                      No image
                    </div>
                  )}
                </div>
                {product.imagePath ? (
                  <div className="mt-4">
                    <a
                      href={`/${product.imagePath}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex rounded-full bg-white border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-900 hover:bg-[#fff7fb] transition-colors"
                    >
                      View Full Image
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 sm:p-8 shadow-sm">
                <p className="text-xs tracking-widest uppercase text-neutral-600">
                  {product.category}
                </p>
                <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
                  {product.title}
                </h1>
                <p className="mt-4 text-neutral-700 leading-relaxed">{product.description}</p>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 border border-neutral-200 px-4 py-3">
                    <span className="text-neutral-600">Price</span>
                    <span className="font-semibold text-neutral-900">
                      ₹{product.price.toFixed(0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-white/70 border border-neutral-200 px-4 py-3">
                    <span className="text-neutral-600">Fabric</span>
                    <span className="font-semibold text-neutral-900">{product.fabric}</span>
                  </div>
                </div>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    href={`/${product.category}`}
                    className="rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-shadow"
                  >
                    Back to {product.category}
                  </Link>
                  <Link
                    href="/contact"
                    className="rounded-full bg-white border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-[#fff7fb] transition-colors"
                  >
                    Enquire Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <div className="mb-6">
            <p className="text-xs tracking-widest uppercase text-neutral-600">More styles</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-neutral-900">
              You may also like
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </Container>
      </section>
    </div>
  );
}

