import fs from "node:fs";
import path from "node:path";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "bellissima_admin";

function isAuthed() {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === "1";
}

function getImageTargetPath() {
  return path.join(process.cwd(), "public", "images", "hero-model.png");
}

export async function POST(req: Request) {
  if (!isAuthed()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
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

  const image = formData.get("image");
  if (!image || typeof image === "string" || !("arrayBuffer" in image)) {
    return NextResponse.json({ error: "Image is required." }, { status: 400 });
  }

  const file = image as File;
  if (file.size <= 0) {
    return NextResponse.json({ error: "Empty image file." }, { status: 400 });
  }

  const targetPath = getImageTargetPath();
  const targetDir = path.dirname(targetPath);
  if (!fs.existsSync(targetDir)) fs.mkdirSync(targetDir, { recursive: true });

  const bytes = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(targetPath, bytes);

  return NextResponse.json({
    ok: true,
    imagePath: "/images/hero-model.png",
  });
}

