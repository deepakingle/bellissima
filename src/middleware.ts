import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_COOKIE_NAME = "bellissima_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isAdminPage = pathname === "/admin" || pathname.startsWith("/admin/");
  const isAdminApi = pathname.startsWith("/api/admin/");
  const isLoginPage = pathname === "/admin/login";
  const isLoginApi = pathname === "/api/admin/login";

  if (!isAdminPage && !isAdminApi) return NextResponse.next();
  if (isLoginPage || isLoginApi) return NextResponse.next();

  const token = req.cookies.get(ADMIN_COOKIE_NAME)?.value;
  if (token === "1") return NextResponse.next();

  if (isAdminApi) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/admin/login", req.url));
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};

