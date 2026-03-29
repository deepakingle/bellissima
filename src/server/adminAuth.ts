import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "bellissima_admin";

export function isAdminAuthed(): boolean {
  return cookies().get(ADMIN_COOKIE_NAME)?.value === "1";
}

