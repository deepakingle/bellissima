import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SiteFooter from "@/components/layout/SiteFooter";
import SiteHeader from "@/components/layout/SiteHeader";
import ClientProviders from "@/components/ClientProviders";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Bellissima - by Priyanka",
  description:
    "A curated fashion catalog with soft blush elegance (storefront + admin catalog).",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          "antialiased",
          "bg-background text-foreground min-h-screen",
          "font-[family-name:var(--font-geist-sans)]",
        ].join(" ")}
      >
        <ClientProviders>
          <div className="min-h-screen flex flex-col">
            <SiteHeader />
            <main className="flex-1">{children}</main>
            <SiteFooter />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
