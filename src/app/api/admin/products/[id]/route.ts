import fs from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import {
  type ProductCategory,
  deleteProduct,
  getProductById,
  updateProduct,
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

function isAuthed() {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === "1";
}

function getUploadsDir() {
  return path.join(process.cwd(), "public", "uploads");
}

function extFromFile(file: File): string {
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

  return `uploads/${filename}`;
}

function getAbsUploadPath(imagePath: string) {
  // imagePath is stored as `uploads/<filename>`
  const abs = path.join(process.cwd(), "public", imagePath);
  return abs;
}

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const product = getProductById(id);
  if (!product) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  return NextResponse.json({ product });
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json(
      { error: "Expected multipart/form-data." },
      { status: 400 }
    );
  }

  const title = formData.get("title");
  const description = formData.get("description");
  const category = parseCategory(formData.get("category"));
  const fabric = formData.get("fabric");
  const priceRaw = formData.get("price");
  const featuredRaw = formData.get("featured");

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
  let imagePath = existing.imagePath;
  if (imageFile && typeof imageFile !== "string" && "arrayBuffer" in imageFile) {
    const f = imageFile as File;
    // Only replace when the user picked a file (size > 0).
    const newImagePath =
      f.size > 0 ? await saveUpload(f) : existing.imagePath;

    if (newImagePath !== existing.imagePath && existing.imagePath) {
      // Replace on disk if possible.
      const uploadsDir = path.resolve(getUploadsDir());
      const oldAbs = path.resolve(getAbsUploadPath(existing.imagePath));
      if (oldAbs.startsWith(uploadsDir) && fs.existsSync(oldAbs)) {
        fs.unlinkSync(oldAbs);
      }
    }

    imagePath = newImagePath;
  }

  const featured =
    featuredRaw === null ? existing.featured : parseFeatured(featuredRaw);

  const product = updateProduct(id, {
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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: "Invalid id." }, { status: 400 });
  }

  const existing = getProductById(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }

  if (existing.imagePath) {
    const uploadsDir = path.resolve(getUploadsDir());
    const oldAbs = path.resolve(getAbsUploadPath(existing.imagePath));
    if (oldAbs.startsWith(uploadsDir) && fs.existsSync(oldAbs)) {
      fs.unlinkSync(oldAbs);
    }
  }

  deleteProduct(id);
  return NextResponse.json({ ok: true });
}

