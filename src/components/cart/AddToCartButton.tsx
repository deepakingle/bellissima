"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/server/db";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <button
      onClick={handleClick}
      className="w-full rounded-full bg-gradient-to-br from-[#FFD6E0] to-[#F7B3C2] border border-[#ead9d4] px-4 py-2.5 text-sm font-semibold text-neutral-900 hover:shadow-sm transition-all active:scale-[0.98]"
    >
      {added ? "Added to cart!" : "Add to Cart"}
    </button>
  );
}
