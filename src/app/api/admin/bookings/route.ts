import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/admin";
import { cancelBooking, listUpcoming } from "@/lib/bookings";

export const dynamic = "force-dynamic";

// GET /api/admin/bookings -> { bookings: [...] }   (studio only)
export async function GET() {
  const admin = await checkAdmin();
  if (!admin.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  try {
    return NextResponse.json({ bookings: await listUpcoming() });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}

// PATCH /api/admin/bookings  body: { id, status: "cancelled" }   (studio only)
export async function PATCH(req: NextRequest) {
  const admin = await checkAdmin();
  if (!admin.ok) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await req.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id : "";
  if (!id || body?.status !== "cancelled") {
    return NextResponse.json({ error: "Expected { id, status: \"cancelled\" }" }, { status: 400 });
  }
  try {
    const changed = await cancelBooking(id, admin.email);
    return changed
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ error: "Not found or already cancelled" }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Database unavailable" }, { status: 503 });
  }
}
