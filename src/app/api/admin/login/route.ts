import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const ADMIN_COOKIE_NAME = "bellissima_admin";

/** Override via ADMIN_USERNAME / ADMIN_PASSWORD; defaults match catalog owner demo credentials. */
const DEFAULT_ADMIN_USERNAME = "priyanka";
const DEFAULT_ADMIN_PASSWORD = "trisha26";

export async function POST(req: Request) {
  const expectedUsername =
    process.env.ADMIN_USERNAME?.trim() || DEFAULT_ADMIN_USERNAME;
  const expectedPassword =
    process.env.ADMIN_PASSWORD?.trim() || DEFAULT_ADMIN_PASSWORD;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const username =
    typeof body === "object" && body !== null && "username" in body
      ? (body as { username?: unknown }).username
      : null;
  const password =
    typeof body === "object" && body !== null && "password" in body
      ? (body as { password?: unknown }).password
      : null;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json(
      { error: "Username and password are required." },
      { status: 400 }
    );
  }

  if (username !== expectedUsername || password !== expectedPassword) {
    return NextResponse.json(
      { error: "Invalid username or password." },
      { status: 401 }
    );
  }

  cookies().set(ADMIN_COOKIE_NAME, "1", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return NextResponse.json({ ok: true });
}
