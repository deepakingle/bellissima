import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";

export default function AboutPage() {
  return (
    <div>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 sm:p-8 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-neutral-600">
              About
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
              Bellissima - by Priyanka
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-700 max-w-2xl leading-relaxed">
              A curated fashion catalog designed for effortless discovery and
              soft-blush elegance.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-6">
              <SectionHeading
                eyebrow="Our focus"
                title="Fabrics, fit, and finishing details"
                subtitle="Explore pieces you can imagine wearing right away."
              />

              <div className="mt-4 text-neutral-700 leading-relaxed space-y-3 text-sm sm:text-base">
                <p>
                  We curate sarees, blouses, lehengas, ghagras, and dupattas
                  with an emphasis on premium texture and refined styling.
                </p>
                <p>
                  This site is catalog-only: browse the collection, use search
                  and category pages to find your style, and reach out via the
                  inquiry form for availability.
                </p>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 shadow-sm">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60 relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/about-1.svg"
                    alt="Bellissima lifestyle placeholder"
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-[#fff] to-[#F7B3C2] opacity-70" />
                </div>
                <p className="mt-4 text-sm text-neutral-600">
                  Replace this placeholder with your own lifestyle image.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

