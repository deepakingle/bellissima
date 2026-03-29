import Link from "next/link";

import Container from "@/components/layout/Container";

export default function AdminHomePage() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="rounded-3xl border border-neutral-200/70 bg-white/50 p-6 sm:p-8 shadow-sm">
          <p className="text-xs tracking-widest uppercase text-neutral-600">
            Admin
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900">
            Catalog Management
          </h1>
          <p className="mt-3 text-neutral-600 max-w-2xl leading-relaxed">
            Add and edit products, upload images, and control which items are
            featured and newly arrived.
          </p>

          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <Link
              href="/admin/products"
              className="rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-shadow"
            >
              Manage Products
            </Link>
            <Link
              href="/admin/appearance"
              className="rounded-full bg-white/70 border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-white transition-colors"
            >
              Change Hero Image
            </Link>
            <Link
              href="/"
              className="rounded-full bg-white/70 border border-neutral-200 px-6 py-3 text-sm font-semibold text-neutral-900 hover:bg-white transition-colors"
            >
              Back to storefront
            </Link>
          </div>

          <p className="mt-6 text-xs text-neutral-500">
            Tip: You must set <span className="font-mono">ADMIN_PASSWORD</span>{" "}
            in your environment to sign in.
          </p>
        </div>
      </Container>
    </section>
  );
}

