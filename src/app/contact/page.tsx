import Container from "@/components/layout/Container";
import SectionHeading from "@/components/layout/SectionHeading";
import ContactForm from "@/components/contact/ContactForm";

export default function ContactPage() {
  return (
    <div>
      <section className="py-10 sm:py-14">
        <Container>
          <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 sm:p-8 shadow-sm">
            <p className="text-xs tracking-widest uppercase text-neutral-600">
              Contact
            </p>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight text-neutral-900">
              Send an inquiry
            </h1>
            <p className="mt-3 text-sm sm:text-base text-neutral-700 max-w-2xl leading-relaxed">
              Share what you’re looking for and we’ll get back soon with
              availability and details.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-14">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-5">
              <SectionHeading
                eyebrow="Quick note"
                title="Catalog-only support"
                subtitle="No checkout—just curated browsing."
              />
              <div className="mt-4 text-sm text-neutral-700 leading-relaxed space-y-3">
                <p>
                  Use the form to send your requirements. You’ll also see a
                  WhatsApp button for a faster conversation.
                </p>
                <p>
                  For the best match, include your preferred category and any
                  color/style notes.
                </p>
              </div>

              <div className="mt-8 pt-6 border-t border-neutral-200/80">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-500 mb-3">
                  Store Location
                </h3>
                <div className="rounded-2xl border border-neutral-200/60 bg-white/40 p-5 shadow-sm">
                  <p className="font-semibold text-neutral-900 mb-1">
                    Bellisima by Priyanka
                  </p>
                  <p className="text-sm text-neutral-700 leading-relaxed">
                    Eastern court, BT Kawade Road,
                    <br />
                    Pune -411054
                  </p>
                </div>
              </div>
            </div>
            <div className="lg:col-span-7">
              <ContactForm />
            </div>
          </div>
        </Container>
      </section>
    </div>
  );
}

