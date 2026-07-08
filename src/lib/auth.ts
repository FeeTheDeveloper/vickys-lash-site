// Minimal admin gate for /admin. Compares a password against ADMIN_PASSWORD and
// stores a hashed token in an httpOnly cookie. No accounts, no DB — just enough
// to keep the bookings list private.

import { cookies } from "next/headers";
import { createHash, timingSafeEqual } from "node:crypto";

const COOKIE = "vll_admin";

function tokenFor(pw: string) {
  return createHash("sha256").update(`vll:${pw}`).digest("hex");
}

export function adminConfigured() {
  return !!process.env.ADMIN_PASSWORD;
}

function safeEqual(a: string, b: string) {
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  return ab.length === bb.length && timingSafeEqual(ab, bb);
}

export async function isAdmin() {
  const pw = process.env.ADMIN_PASSWORD;
  if (!pw) return false;
  const jar = await cookies();
  const got = jar.get(COOKIE)?.value;
  return !!got && safeEqual(got, tokenFor(pw));
}

/** Returns true and sets the session cookie on a correct password. */
export async function signIn(pw: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected || !safeEqual(pw, expected)) return false;
  const jar = await cookies();
  jar.set(COOKIE, tokenFor(expected), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 days
  });
  return true;
}

export async function signOut() {
  const jar = await cookies();
  jar.delete(COOKIE);
}
