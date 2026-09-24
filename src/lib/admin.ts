// Studio access = signed in with Clerk AND on the ADMIN_EMAILS allowlist.
// Middleware already requires a session; this adds the "is this Vicky?" check,
// so a stranger who signs up through Clerk still sees nothing.

import "server-only";
import { currentUser } from "@clerk/nextjs/server";

function allowlist() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export type AdminCheck =
  | { ok: true; email: string }
  | { ok: false; reason: "signed-out" | "not-allowed" };

export async function checkAdmin(): Promise<AdminCheck> {
  const user = await currentUser();
  if (!user) return { ok: false, reason: "signed-out" };
  const allowed = allowlist();
  const email = user.emailAddresses
    .filter((e) => e.verification?.status === "verified")
    .map((e) => e.emailAddress.toLowerCase())
    .find((e) => allowed.includes(e));
  return email ? { ok: true, email } : { ok: false, reason: "not-allowed" };
}
