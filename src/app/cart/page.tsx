"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import Container from "@/components/layout/Container";

export default function CartPage() {
  const { items, removeFromCart, setQuantity, totalPrice, clearCart } =
    useCart();
  const [mounted, setMounted] = useState(false);

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
            <p className="mt-2 text-sm text-neutral-600">
              Browse our collection and add items to get started.
            </p>
            <Link
              href="/"
              className="mt-6 inline-flex rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-10 sm:py-14">
      <Container>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900 mb-8">
          Your Cart
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="rounded-3xl border border-neutral-200/70 bg-white/70 p-4 sm:p-5 shadow-sm flex gap-4"
              >
                <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-neutral-200/60 bg-white/40 flex-shrink-0">
                  {product.imagePath ? (
                    <Image
                      src={`/${product.imagePath}`}
                      alt={product.title}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs">
                      No image
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${product.id}`}
                    className="text-base font-semibold text-neutral-900 hover:underline line-clamp-1"
                  >
                    {product.title}
                  </Link>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {product.fabric} · {product.category}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-neutral-900">
                    ₹{(product.price * quantity).toFixed(0)}
                  </p>

                  <div className="mt-3 flex items-center gap-3">
                    <div className="flex items-center gap-1 rounded-full border border-neutral-200 bg-white px-1.5 py-1">
                      <button
                        onClick={() =>
                          setQuantity(product.id, quantity - 1)
                        }
                        className="w-6 h-6 rounded-full text-neutral-700 hover:bg-neutral-100 flex items-center justify-center text-base font-medium transition-colors"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-neutral-900">
                        {quantity}
                      </span>
                      <button
                        onClick={() =>
                          setQuantity(product.id, quantity + 1)
                        }
                        className="w-6 h-6 rounded-full text-neutral-700 hover:bg-neutral-100 flex items-center justify-center text-base font-medium transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-xs text-neutral-500 hover:text-red-500 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              onClick={clearCart}
              className="text-sm text-neutral-400 hover:text-red-500 transition-colors"
            >
              Clear cart
            </button>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-3xl border border-neutral-200/70 bg-white/70 p-6 shadow-sm sticky top-24">
              <h2 className="text-lg font-semibold text-neutral-900 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 text-sm">
                {items.map(({ product, quantity }) => (
                  <div
                    key={product.id}
                    className="flex justify-between text-neutral-700"
                  >
                    <span className="truncate pr-2">
                      {product.title} × {quantity}
                    </span>
                    <span className="flex-shrink-0">
                      ₹{(product.price * quantity).toFixed(0)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-neutral-200 pt-4 flex justify-between font-semibold text-neutral-900">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(0)}</span>
              </div>
              <Link
                href="/checkout"
                className="mt-5 block text-center rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-6 py-3 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-all"
              >
                Proceed to Checkout →
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
