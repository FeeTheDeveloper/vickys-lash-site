import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  DAYS_AHEAD,
  HOURS,
  daySlots,
  getService,
  iso,
  type DayAvailability,
  type Interval,
} from "@/lib/schedule";

// Availability depends on live bookings + current time — never cache it.
export const dynamic = "force-dynamic";

// GET /api/availability?serviceId=classic
// -> { serviceId, days: [{ date: "2026-07-09", slots: [600, 630, ...] }] }
export async function GET(req: NextRequest) {
  const serviceId = req.nextUrl.searchParams.get("serviceId") ?? "";
  const service = getService(serviceId);
  if (!service) {
    return NextResponse.json({ error: "Unknown service" }, { status: 400 });
  }

  const now = new Date();
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  // Candidate dates that fall on an open day.
  const dates: string[] = [];
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (HOURS[d.getDay()]) dates.push(iso(d));
  }

  // Pull existing bookings for those dates. If the DB isn't reachable yet
  // (no DATABASE_URL configured), fall back to an empty schedule so the site
  // still previews end-to-end — only real persistence needs the database.
  let byDate = new Map<string, Interval[]>();
  try {
    const rows = await prisma.booking.findMany({
      where: { date: { in: dates } },
      select: { date: true, start: true, end: true },
    });
    byDate = rows.reduce((map, r) => {
      const list = map.get(r.date) ?? [];
      list.push({ start: r.start, end: r.end });
      map.set(r.date, list);
      return map;
    }, new Map<string, Interval[]>());
  } catch {
    // no DB yet — treat every slot as open
  }

  const days: DayAvailability[] = [];
  for (const date of dates) {
    const slots = daySlots(date, service, byDate.get(date) ?? [], now);
    if (slots.length) days.push({ date, slots });
  }

  return NextResponse.json({ serviceId, days });
}
