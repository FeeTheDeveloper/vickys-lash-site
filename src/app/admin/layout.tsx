import { ClerkProvider } from "@clerk/nextjs";

// Clerk is scoped to the studio area so the public site never depends on it.
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      signInUrl="/admin/sign-in"
      signInFallbackRedirectUrl="/admin"
      afterSignOutUrl="/admin/sign-in"
    >
      {children}
    </ClerkProvider>
  );
}
