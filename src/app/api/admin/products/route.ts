import fs from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  type ProductCategory,
  getAllProducts,
  insertProduct,
} from "@/server/db";

const ADMIN_COOKIE_NAME = "bellissima_admin";

const allowedCategories: ProductCategory[] = [
  "sarees",
  "blouses",
  "lehenga",
  "ghagras",
  "dupattas",
];

function parseCategory(value: unknown): ProductCategory | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.toLowerCase();
  return allowedCategories.includes(v as ProductCategory)
    ? (v as ProductCategory)
    : undefined;
}

function parseFeatured(value: unknown): boolean {
  if (typeof value !== "string") return false;
  const v = value.toLowerCase();
  return v === "1" || v === "true" || v === "yes" || v === "on";
}

function getUploadsDir() {
  return path.join(process.cwd(), "public", "uploads");
}

function extFromFile(file: File): string {
  // Keep it simple and safe: rely on name/type, default to png.
  const name = file.name || "";
  const byName = name.includes(".") ? name.split(".").pop() : undefined;
  const byType = file.type?.includes("/") ? file.type.split("/").pop() : "";
  const ext = (byName || byType || "png").toLowerCase();
  if (!ext) return ".png";
  return ext.startsWith(".") ? `.${ext.slice(1)}` : `.${ext}`;
}

async function saveUpload(file: File): Promise<string> {
  const uploadsDir = getUploadsDir();
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

  const filename = `${Date.now()}-${Math.random().toString(16).slice(2)}${extFromFile(
    file
  )}`;
  const absPath = path.join(uploadsDir, filename);

  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(absPath, bytes);

  // Stored relative to public/.
  return `uploads/${filename}`;
}

function isAuthed() {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === "1";
}

export async function GET() {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ products: getAllProducts() });
}

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected multipart/form-data." }, { status: 400 });
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const category = parseCategory(formData.get("category"));
  const fabric = formData.get("fabric");
  const priceRaw = formData.get("price");
  const featured = parseFeatured(formData.get("featured"));

  if (
    typeof title !== "string" ||
    typeof description !== "string" ||
    !category ||
    typeof fabric !== "string" ||
    typeof priceRaw !== "string"
  ) {
    return NextResponse.json(
      { error: "Missing or invalid fields." },
      { status: 400 }
    );
  }

  const price = Number(priceRaw);
  if (!Number.isFinite(price)) {
    return NextResponse.json({ error: "Invalid price." }, { status: 400 });
  }

  const imageFile = formData.get("image");
  let imagePath: string | null = null;
  if (
    imageFile &&
    typeof imageFile !== "string" &&
    "arrayBuffer" in imageFile
  ) {
    // Next provides multipart uploads as Web File objects.
    const f = imageFile as File;
    if (f.size > 0) imagePath = await saveUpload(f);
  }

  const product = await insertProduct({
    category,
    title,
    description,
    price,
    fabric,
    imagePath,
    featured,
  });

  return NextResponse.json({ product });
}

