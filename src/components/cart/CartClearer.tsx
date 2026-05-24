"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

// Clears the cart on mount. Rendered only on the success return page.
export default function CartClearer() {
  const { clearCart } = useCart();
  useEffect(() => {
    clearCart();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
