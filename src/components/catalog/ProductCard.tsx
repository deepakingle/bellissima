import Image from "next/image";
import Link from "next/link";

import type { Product } from "@/server/db";
import AddToCartButton from "@/components/cart/AddToCartButton";

export default function ProductCard({ product }: { product: Product }) {
  return (
    <div className="group rounded-3xl border border-neutral-200/70 bg-white/50 shadow-sm hover:shadow-md transition-shadow hover:-translate-y-0.5 flex flex-col">
      <Link href={`/product/${product.id}`} className="block p-4 sm:p-5 flex-1">
        <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border border-neutral-200/60 bg-white/30">
          {product.imagePath ? (
            <Image
              src={`/${product.imagePath}`}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-neutral-500 text-sm">
              Image
            </div>
          )}
        </div>

        <div className="mt-4">
          <h3 className="text-base sm:text-lg font-semibold tracking-tight text-neutral-900">
            {product.title}
          </h3>
          <p className="mt-2 text-sm text-neutral-600 line-clamp-2">
            {product.description}
          </p>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-neutral-800">
              {product.fabric}
            </p>
            <p className="text-sm font-semibold text-neutral-900">
              ₹{product.price.toFixed(0)}
            </p>
          </div>
        </div>
      </Link>

      <div className="px-4 sm:px-5 pb-4 sm:pb-5">
        <AddToCartButton product={product} />
      </div>
    </div>
  );
}
