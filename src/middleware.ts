import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Only studio routes go through Clerk — the public site and booking API stay
// static/unauthenticated, so they keep working even before Clerk is configured.
const isSignIn = createRouteMatcher(["/admin/sign-in(.*)"]);
const isProtected = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtected(req) && !isSignIn(req)) await auth.protect();
});

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
