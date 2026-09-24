import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Studio sign in · Vicky's Lash Lab",
  robots: { index: false, follow: false },
};

export default function SignInPage() {
  return (
    <main className="admin-wrap admin-signin">
      <SignIn />
    </main>
  );
}
