// Studio-side booking queries, shared by the /admin page, its server actions,
// and the /api/admin/bookings route. Callers must check admin access first.

import "server-only";
import { prisma } from "@/lib/db";
import { iso } from "@/lib/schedule";

export async function listUpcoming() {
  return prisma.booking.findMany({
    where: { date: { gte: iso(new Date()) }, status: { not: "cancelled" } },
    orderBy: [{ date: "asc" }, { start: "asc" }],
    select: {
      id: true,
      date: true,
      start: true,
      end: true,
      service: true,
      price: true,
      name: true,
      email: true,
      phone: true,
      status: true,
    },
  });
}

export type UpcomingBooking = Awaited<ReturnType<typeof listUpcoming>>[number];

/** Soft-cancel: frees the slot but keeps the row for the audit trail. */
export async function cancelBooking(id: string, by: string) {
  const res = await prisma.booking.updateMany({
    where: { id, status: { not: "cancelled" } },
    data: { status: "cancelled" },
  });
  if (res.count) {
    console.info(
      JSON.stringify({ event: "booking.cancelled", at: new Date().toISOString(), id, by }),
    );
  }
  return res.count > 0;
}
