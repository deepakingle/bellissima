"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import type { CartItem } from "@/context/CartContext";
import Container from "@/components/layout/Container";

type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState<CustomerDetails>({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="py-16">
        <Container>
          <div className="h-48 rounded-3xl border border-neutral-200/70 bg-white/70 animate-pulse" />
        </Container>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-16">
        <Container>
          <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-10 text-center shadow-sm">
            <p className="text-2xl font-semibold text-neutral-900">
              Your cart is empty
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-6 py-3 text-sm font-semibold text-neutral-900"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer: form, items }),
      });

      const data = (await res.json()) as {
        redirectUrl?: string;
        error?: string;
      };

      if (!res.ok || !data.redirectUrl) {
        setError(
          data.error || "Failed to initiate payment. Please try again."
        );
        setLoading(false);
        return;
      }

      window.location.href = data.redirectUrl;
    } catch {
      setError("Network error. Please check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-8">
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
            <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm space-y-4">
              <h2 className="text-lg font-semibold text-neutral-900">
                Your Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Full Name *
                </label>
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, name: e.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#F7B3C2]/40 focus:border-[#F7B3C2]"
                  placeholder="Priya Sharma"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email Address *
                </label>
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#F7B3C2]/40 focus:border-[#F7B3C2]"
                  placeholder="priya@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  required
                  type="tel"
                  pattern="[0-9]{10}"
                  value={form.phone}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, phone: e.target.value }))
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#F7B3C2]/40 focus:border-[#F7B3C2]"
                  placeholder="9876543210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  required
                  value={form.address}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, address: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm text-neutral-900 outline-none focus:ring-2 focus:ring-[#F7B3C2]/40 focus:border-[#F7B3C2] resize-none"
                  placeholder="123, Main Street, Mumbai, 400001"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-6 py-4 text-sm font-semibold text-neutral-900 hover:shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading
                ? "Redirecting to payment gateway..."
                : `Pay Now · ₹${totalPrice.toFixed(0)}`}
            </button>

            <p className="text-center text-xs text-neutral-400">
              You will be redirected to Phi Commerce secure payment page.
            </p>
          </form>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-3">
                {items.map(({ product, quantity }: CartItem) => (
                  <div key={product.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-neutral-200/60 bg-white/40 flex-shrink-0">
                      {product.imagePath ? (
                        <Image
                          src={`/${product.imagePath}`}
                          alt={product.title}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      ) : null}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-neutral-900 truncate">
                        {product.title}
                      </p>
                      <p className="text-xs text-neutral-500">
                        Qty: {quantity}
                      </p>
                    </div>
                    <p className="text-xs font-semibold text-neutral-900 flex-shrink-0">
                      ₹{(product.price * quantity).toFixed(0)}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-neutral-200 pt-4 flex justify-between font-semibold text-neutral-900">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(0)}</span>
              </div>
              <Link
                href="/cart"
                className="mt-3 block text-center text-xs text-neutral-500 hover:text-neutral-700 transition-colors"
              >
                ← Edit cart
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
