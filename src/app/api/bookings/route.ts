import { NextRequest, NextResponse, after } from "next/server";
import { prisma } from "@/lib/db";
import { DAYS_AHEAD, daySlots, getService, iso, type Interval } from "@/lib/schedule";
import { sendBookingEmails } from "@/lib/email";
import { BOOKING_MODE, SITE } from "@/lib/site";
import { clientIp, rateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 4096;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[0-9+().\-\s]{7,25}$/;
const KEY_RE = /^[A-Za-z0-9-]{8,64}$/;

// Advisory-lock namespace so these locks can't collide with anything else.
const LOCK_NS = 4242;

class SlotTaken extends Error {}

function fail(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function audit(event: string, data: Record<string, unknown>) {
  // Structured, PII-free log line for Vercel log search.
  console.info(JSON.stringify({ event, at: new Date().toISOString(), ...data }));
}

/** True if `date` is a real calendar date between today and DAYS_AHEAD out. */
function inBookingWindow(date: string, now: Date) {
  if (!DATE_RE.test(date)) return false;
  const d = new Date(date + "T00:00:00");
  if (Number.isNaN(d.getTime()) || iso(d) !== date) return false;
  const last = new Date(now);
  last.setDate(now.getDate() + DAYS_AHEAD - 1);
  return date >= iso(now) && date <= iso(last);
}

// POST /api/bookings
// body: { serviceId, date, start, name, email?, phone?, idempotencyKey?, website? }
export async function POST(req: NextRequest) {
  if (BOOKING_MODE !== "inhouse") {
    return fail(`Online booking is handled at ${SITE.acuityUrl}.`, 404);
  }

  const ip = clientIp(req.headers);
  if (!rateLimit(`book:${ip}`, 5, 10 * 60_000)) {
    audit("booking.rate_limited", { ip });
    return fail("Too many booking attempts — please wait a few minutes.", 429);
  }

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return fail("Request too large.", 413);

  let body: Record<string, unknown>;
  try {
    body = JSON.parse(raw);
    if (!body || typeof body !== "object") throw new Error();
  } catch {
    return fail("Invalid request.", 400);
  }

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

  // Honeypot: real visitors never see or fill this field.
  if (str(body.website)) {
    audit("booking.honeypot", { ip });
    return NextResponse.json({ ok: true }, { status: 201 });
  }

  const service = getService(str(body.serviceId));
  const date = str(body.date);
  const start = Number(body.start);
  const name = str(body.name);
  const email = str(body.email) || null;
  const phone = str(body.phone) || null;
  const idempotencyKey = str(body.idempotencyKey) || null;
  const now = new Date();

  if (!service || !inBookingWindow(date, now) || !Number.isInteger(start)) {
    return fail("Missing booking details.", 400);
  }
  if (!name || !(email || phone)) {
    return fail("Add your name and an email or phone so Vicky can confirm.", 400);
  }
  if (name.length > 80) return fail("Please shorten your name.", 400);
  if (email && (email.length > 254 || !EMAIL_RE.test(email))) {
    return fail("That email doesn't look right.", 400);
  }
  if (phone && !PHONE_RE.test(phone)) return fail("That phone number doesn't look right.", 400);
  if (idempotencyKey && !KEY_RE.test(idempotencyKey)) return fail("Invalid request.", 400);

  try {
    const { booking, replay } = await prisma.$transaction(async (tx) => {
      // Serialize every booking for this date so the overlap check below and
      // the insert are atomic — no two requests can both see a slot as free.
      await tx.$queryRaw`SELECT pg_advisory_xact_lock(${LOCK_NS}::int, hashtext(${date}))::text AS locked`;

      // Replay of a submission that already succeeded (double-click, retry).
      if (idempotencyKey) {
        const existing = await tx.booking.findUnique({ where: { idempotencyKey } });
        if (existing) return { booking: existing, replay: true };
      }

      const rows = await tx.booking.findMany({
        where: { date, status: { not: "cancelled" } },
        select: { start: true, end: true },
      });
      const booked: Interval[] = rows.map((r) => ({ start: r.start, end: r.end }));
      if (!daySlots(date, service, booked, now).includes(start)) throw new SlotTaken();

      const created = await tx.booking.create({
        data: {
          date,
          start,
          end: start + service.dur,
          serviceId: service.id,
          service: service.name,
          price: service.price,
          name,
          email,
          phone,
          idempotencyKey,
        },
      });
      return { booking: created, replay: false };
    });

    if (replay) return NextResponse.json({ ok: true, id: booking.id }, { status: 200 });

    audit("booking.created", { id: booking.id, date, start, serviceId: service.id });

    // Fire confirmation emails after the response is sent — never blocks or
    // fails the booking (no-ops if Resend isn't configured).
    after(async () => {
      try {
        await sendBookingEmails(booking);
      } catch (e) {
        audit("booking.email_failed", { id: booking.id, error: String(e) });
      }
    });

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    if (err instanceof SlotTaken) {
      audit("booking.conflict", { date, start, serviceId: service.id });
      return fail("That time was just taken — please pick another.", 409);
    }
    audit("booking.failed", { date, start, serviceId: service.id, error: String(err) });
    return fail("We couldn't save your booking — please try again or DM us on Instagram.", 503);
  }
}
