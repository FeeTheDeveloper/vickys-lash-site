"use server";

import { redirect } from "next/navigation";
import { signIn, signOut } from "@/lib/auth";

export type LoginState = { error?: string };

export async function loginAction(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const pw = String(formData.get("password") ?? "");
  const ok = await signIn(pw);
  if (!ok) return { error: "Incorrect password." };
  redirect("/admin");
}

export async function logoutAction() {
  await signOut();
  redirect("/admin");
}
