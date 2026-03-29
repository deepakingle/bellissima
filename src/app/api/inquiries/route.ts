import { NextResponse } from "next/server";

import { insertInquiry } from "@/server/db";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name =
    typeof body === "object" && body && "name" in body
      ? (body as { name?: unknown }).name
      : undefined;
  const phone =
    typeof body === "object" && body && "phone" in body
      ? (body as { phone?: unknown }).phone
      : undefined;
  const email =
    typeof body === "object" && body && "email" in body
      ? (body as { email?: unknown }).email
      : undefined;
  const message =
    typeof body === "object" && body && "message" in body
      ? (body as { message?: unknown }).message
      : undefined;

  if (typeof name !== "string" || !name.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }
  if (typeof phone !== "string" || !phone.trim()) {
    return NextResponse.json(
      { error: "Phone is required." },
      { status: 400 }
    );
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { error: "Message is required." },
      { status: 400 }
    );
  }

  insertInquiry({
    name: name.trim(),
    phone: phone.trim(),
    email: typeof email === "string" ? email.trim() : undefined,
    message: message.trim(),
  });

  return NextResponse.json({ ok: true });
}

