import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { supabaseAdmin, supabaseConfigured } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

// GET /api/health -> which backing services are configured and reachable.
// Reports only true/false, never config values.
export async function GET() {
  const checks = {
    database: false,
    supabase: false,
    clerk: !!(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY),
    adminAllowlist: !!process.env.ADMIN_EMAILS?.trim(),
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = true;
  } catch {}

  if (supabaseConfigured()) {
    try {
      const { error } = await supabaseAdmin().storage.listBuckets();
      checks.supabase = !error;
    } catch {}
  }

  const ok = Object.values(checks).every(Boolean);
  return NextResponse.json({ ok, checks }, { status: ok ? 200 : 503 });
}
