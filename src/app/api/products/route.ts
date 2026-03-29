import { NextResponse } from "next/server";

import {
  type ProductCategory,
  getFeaturedProducts,
  getLatestProducts,
  getProductsByCategory,
  searchProducts,
} from "@/server/db";

const categories: ProductCategory[] = [
  "sarees",
  "blouses",
  "lehenga",
  "ghagras",
  "dupattas",
];

function parseBool(value: string | null): boolean {
  if (!value) return false;
  const v = value.toLowerCase();
  return v === "1" || v === "true" || v === "yes";
}

function parseCategory(value: string | null): ProductCategory | undefined {
  if (!value) return undefined;
  const v = value.toLowerCase();
  return categories.includes(v as ProductCategory) ? (v as ProductCategory) : undefined;
}

function parseLimit(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number(value);
  if (!Number.isFinite(n)) return undefined;
  return Math.min(Math.max(Math.floor(n), 1), 50);
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q");

  const category = parseCategory(url.searchParams.get("category"));
  const featured = parseBool(url.searchParams.get("featured"));
  const latest = parseBool(url.searchParams.get("latest"));
  const limit = parseLimit(url.searchParams.get("limit"));

  let products;

  if (q) {
    products = searchProducts({
      q,
      category,
      limit: limit ?? 24,
    });
  } else if (category) {
    products = getProductsByCategory(category, limit ?? 24);
  } else if (featured) {
    products = getFeaturedProducts(limit ?? 12);
  } else if (latest) {
    products = getLatestProducts(limit ?? 12);
  } else {
    products = getLatestProducts(limit ?? 24);
  }

  return NextResponse.json({ products });
}

