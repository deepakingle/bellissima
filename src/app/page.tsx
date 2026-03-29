import Image from "next/image";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Section from "@/components/layout/Section";
import SectionHeading from "@/components/layout/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";

import type { ProductCategory } from "@/server/db";
import {
  getFeaturedProducts,
  getLatestProducts,
} from "@/server/db";

import CategoryCard from "@/components/catalog/CategoryCard";
import ProductCard from "@/components/catalog/ProductCard";

export default function Home() {
  const featured = getFeaturedProducts(8);
  const latest = getLatestProducts(8);

  const categories: Array<{ href: string; value: ProductCategory; label: string; blurb: string }> =
    [
      {
        href: "/sarees",
        value: "sarees",
        label: "Sarees",
        blurb: "Graceful drapes in timeless weaves.",
      },
      {
        href: "/blouses",
        value: "blouses",
        label: "Blouses",
        blurb: "Perfect fits and elegant details.",
      },
      {
        href: "/lehenga",
        value: "lehenga",
        label: "Lehengas",
        blurb: "Statement silhouettes for every celebration.",
      },
      {
        href: "/ghagras",
        value: "ghagras",
        label: "Ghagras",
        blurb: "Bold, festive and beautifully styled.",
      },
      {
        href: "/dupattas",
        value: "dupattas",
        label: "Dupattas",
        blurb: "Add the finishing touch in pure charm.",
      },
    ];

  return (
    <main>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="text-xs tracking-widest uppercase text-neutral-600">
                Bellissima - by Priyanka
              </p>
              <h1 className="mt-3 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
                Soft-blush elegance for every occasion.
              </h1>
              <p className="mt-4 text-neutral-700 max-w-xl leading-relaxed">
                Browse a curated fashion catalog. This is a catalog-only
                experience: no cart, no checkout, just beautiful pieces.
              </p>

              <div className="mt-7 flex flex-col sm:flex-row gap-3">
                <Link
                  href="/sarees"
                  className="rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-shadow"
                >
                  Explore Collection
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-4">
                  <p className="text-xs tracking-widest uppercase text-neutral-500">
                    Premium feel
                  </p>
                  <p className="mt-2 text-neutral-900 font-semibold">
                    Soft borders & elegant spacing
                  </p>
                </div>
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-4">
                  <p className="text-xs tracking-widest uppercase text-neutral-500">
                    Catalog-only
                  </p>
                  <p className="mt-2 text-neutral-900 font-semibold">
                    Pure browsing experience
                  </p>
                </div>
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-4">
                  <p className="text-xs tracking-widest uppercase text-neutral-500">
                    Quick search
                  </p>
                  <p className="mt-2 text-neutral-900 font-semibold">
                    Find by category & keywords
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 shadow-sm">
                <div className="relative aspect-[4/3] rounded-2xl border border-neutral-200/60 overflow-hidden">
                  <Image
                    src="/images/hero-model.png"
                    alt="Bellissima featured model"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2b1f21]/45 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="rounded-2xl border border-white/40 bg-white/20 backdrop-blur-sm px-4 py-3 shadow-sm text-center">
                      <p className="text-[11px] tracking-widest uppercase text-white/90">
                        Bellissima Edit
                      </p>
                      <p className="mt-1 text-white font-semibold text-base">
                        Your newest arrivals, curated for you.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 text-sm text-neutral-600 leading-relaxed">
                  Featured picks below. Use category browsing to discover
                  sarees, blouses, lehengas, ghagras and dupattas.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Categories"
            title="Explore the collection"
            subtitle="Choose a style and browse matching pieces."
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((c) => (
              <CategoryCard
                key={c.value}
                href={c.href}
                label={c.label}
                description={c.blurb}
                badge={c.value === "lehenga" ? "New" : undefined}
              />
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Featured"
            title="Premium favorites"
            subtitle="Handpicked and marked as featured."
            align="left"
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {featured.length ? (
              featured.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6">
                  <p className="text-neutral-900 font-semibold">
                    No featured products yet.
                  </p>
                  <p className="mt-2 text-neutral-600 text-sm">
                    Add featured items in the admin panel to see them here.
                  </p>
                  <Link
                    href="/admin/login"
                    className="inline-flex mt-4 rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-5 py-2 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-shadow"
                  >
                    Go to Admin
                  </Link>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="New Arrivals"
            title="Recently added"
            subtitle="Most recently created products."
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latest.length ? (
              latest.map((p) => <ProductCard key={p.id} product={p} />)
            ) : (
              <div className="sm:col-span-2 lg:col-span-4">
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6">
                  <p className="text-neutral-900 font-semibold">
                    No products yet.
                  </p>
                  <p className="mt-2 text-neutral-600 text-sm">
                    Seed products (or add them in admin) to populate the
                    catalog.
                  </p>
                </div>
              </div>
            )}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="About"
                title="Bellissima - by Priyanka"
                subtitle="A curated catalog designed for effortless discovery."
              />
              <div className="mt-4 text-neutral-700 leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  We focus on fabrics, fit, and finishing touches. Explore pieces
                  you can imagine wearing right away, from everyday elegance
                  to festive celebrations.
                </p>
                <p>
                  Every product card highlights the essentials: title, fabric,
                  description and price. Add new items anytime via the admin
                  dashboard.
                </p>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 shadow-sm">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about-1.svg"
                    alt="Lifestyle placeholder"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fff] to-[#F7B3C2] opacity-75" />
                  <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[#FFD6E0]/60 blur-2xl" />
                  <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-[#C9A227]/15 blur-2xl" />
                  <div className="absolute inset-0 flex items-end p-5">
                    <div className="rounded-3xl bg-white/70 border border-neutral-200/60 px-5 py-4 shadow-sm">
                      <p className="text-xs tracking-widest uppercase text-neutral-600">
                        Lifestyle image placeholder
                      </p>
                      <p className="mt-2 text-neutral-900 font-semibold">
                        Soft colors, premium feel.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-sm text-neutral-600">
                  Replace this area with your own lifestyle photo for a
                  personalized brand story.
                </div>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Testimonials"
            title="Loved by customers"
            subtitle="A few words from our fashion lovers."
          />

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                name: "Ananya",
                quote:
                  "The catalog feels so premium and the product cards are super clear. I found exactly what I wanted.",
              },
              {
                name: "Meera",
                quote:
                  "Soft, elegant, and easy to browse. The categories make searching effortless.",
              },
              {
                name: "Priya",
                quote:
                  "I love the blush aesthetic. Everything looks polished and modern without feeling overwhelming.",
              },
              {
                name: "Radhika",
                quote:
                  "Fast to navigate, beautiful layout, and the details on each product card are perfect.",
              },
            ].map((t) => (
              <div
                key={t.name}
                className="rounded-3xl border border-neutral-200/70 bg-white/50 p-5 shadow-sm"
              >
                <div className="text-neutral-900 font-semibold">{t.name}</div>
                <p className="mt-3 text-sm text-neutral-700 leading-relaxed">
                  {t.quote}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionHeading
            eyebrow="Gallery"
            title="Instagram-style inspiration"
            subtitle="Add your fashion shots to replace these placeholders."
          />

          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[1/1] rounded-3xl border border-neutral-200/70 bg-white/50 overflow-hidden relative group"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/gallery/gallery-${i + 1}.svg`}
                  alt="Gallery photo placeholder"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-br from-[#FFD6E0]/20 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-xs tracking-widest uppercase text-neutral-700">
                    Photo
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </Section>

      <Section>
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Contact"
                title="Send an inquiry"
                subtitle="Tell us what you’re looking for and we’ll respond soon."
              />
              <div className="mt-4 text-sm text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Fill out the form and we’ll reach out with availability and
                  details.
                </p>
                <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-5 shadow-sm">
                  <p className="text-xs tracking-widest uppercase text-neutral-600">
                    WhatsApp CTA
                  </p>
                  <p className="mt-2 text-neutral-900 font-semibold">
                    Prefer to chat? Use WhatsApp below.
                  </p>
                  <p className="mt-2 text-neutral-600">
                    For production, update the WhatsApp number in the component.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </Section>
    </main>
  );
}
