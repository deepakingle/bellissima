import Link from "next/link";
import Image from "next/image";
import Container from "./Container";
import CartIcon from "@/components/cart/CartIcon";

const navItems = [
  { href: "/sarees", label: "Sarees" },
  { href: "/blouses", label: "Blouses" },
  { href: "/lehenga", label: "Lehengas" },
  { href: "/ghagras", label: "Ghagras" },
  { href: "/dupattas", label: "Dupattas" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 bg-[rgba(255,252,250,0.86)] backdrop-blur border-b border-[#f3dfe4] shadow-[0_6px_24px_rgba(247,179,194,0.12)]">
      <Container>
        <div className="flex items-center justify-between gap-4 py-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-3 group"
              aria-label="Bellissima home"
            >
              <span className="grid place-items-center h-11 w-11 rounded-full border border-[#ead9d4] bg-white/80 overflow-hidden shadow-sm transition-transform group-hover:scale-[1.04]">
                <Image
                  src="/images/logo.png"
                  alt="Bellissima logo"
                  width={44}
                  height={44}
                  className="h-full w-full object-cover"
                />
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm sm:text-base font-semibold text-neutral-900">
                  Bellissima
                </span>
                <span className="text-xs text-neutral-600">
                  by Priyanka
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm text-neutral-700">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-neutral-900 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <form
              className="hidden sm:flex items-center"
              action="/search"
              method="get"
            >
              <label htmlFor="site-search" className="sr-only">
                Search products
              </label>
              <input
                id="site-search"
                type="search"
                name="q"
                placeholder="Search sarees, lehengas..."
                className="w-[220px] rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm text-neutral-900 placeholder:text-neutral-500 outline-none focus:ring-2 focus:ring-[#C9A227]/30 focus:border-[#C9A227]/50"
              />
            </form>

            <CartIcon />

            <Link
              href="/admin/login"
              className="rounded-full border border-neutral-200/80 bg-white/70 px-4 py-2 text-sm font-medium text-neutral-900 hover:bg-white transition-colors"
            >
              Admin
            </Link>
          </div>
        </div>
      </Container>
    </header>
  );
}

