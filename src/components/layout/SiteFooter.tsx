import Link from "next/link";
import Image from "next/image";
import Container from "./Container";

const footerLinks = [
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/sarees", label: "Sarees" },
  { href: "/blouses", label: "Blouses" },
  { href: "/lehenga", label: "Lehengas" },
  { href: "/ghagras", label: "Ghagras" },
  { href: "/dupattas", label: "Dupattas" },
] as const;

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[rgba(255,252,250,0.72)] border-t border-[#f3dfe4]">
      <Container>
        <div className="py-10 sm:py-12 flex flex-col gap-6 sm:gap-4">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6">
            <div className="max-w-md">
              <div className="flex items-center gap-3">
                <span className="grid place-items-center h-10 w-10 rounded-full border border-[#ead9d4] bg-white/80 overflow-hidden shadow-sm">
                  <Image
                    src="/images/logo.png"
                    alt="Bellissima logo"
                    width={40}
                    height={40}
                    className="h-full w-full object-cover"
                  />
                </span>
                <p className="text-neutral-900 font-semibold text-lg">
                  Bellissima - by Priyanka
                </p>
              </div>
              <p className="mt-2 text-sm text-neutral-600">
                A curated fashion catalog with soft blush elegance.
              </p>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              {footerLinks.slice(0, 4).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {footerLinks.slice(4).map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="text-neutral-700 hover:text-neutral-900 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
            <p className="text-sm text-neutral-500">
              © {year} Bellissima. All rights reserved.
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}

