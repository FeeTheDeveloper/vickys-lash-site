import { NextRequest, NextResponse, after } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { daySlots, getService, type Interval } from "@/lib/schedule";
import { sendBookingEmails } from "@/lib/email";

export const dynamic = "force-dynamic";

// POST /api/bookings
// body: { serviceId, date, start, name, email?, phone? }
export async function POST(req: NextRequest) {
  let body: {
    serviceId?: string;
    date?: string;
    start?: number;
    name?: string;
    email?: string;
    phone?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const { serviceId, date, name } = body;
  const start = Number(body.start);
  const email = body.email?.trim() || null;
  const phone = body.phone?.trim() || null;

  const service = getService(serviceId ?? "");
  if (!service || !date || !Number.isFinite(start)) {
    return NextResponse.json({ error: "Missing booking details." }, { status: 400 });
  }
  if (!name?.trim() || !(email || phone)) {
    return NextResponse.json(
      { error: "Add your name and an email or phone so Vicky can confirm." },
      { status: 400 },
    );
  }

  try {
    // Re-validate the slot against live bookings before writing.
    const rows = await prisma.booking.findMany({
      where: { date },
      select: { start: true, end: true },
    });
    const booked: Interval[] = rows.map((r) => ({ start: r.start, end: r.end }));
    if (!daySlots(date, service, booked, new Date()).includes(start)) {
      return NextResponse.json(
        { error: "That time was just taken — please pick another." },
        { status: 409 },
      );
    }

    const booking = await prisma.booking.create({
      data: {
        date,
        start,
        end: start + service.dur,
        serviceId: service.id,
        service: service.name,
        price: service.price,
        name: name.trim(),
        email,
        phone,
      },
    });

    // Fire confirmation emails after the response is sent — never blocks or
    // fails the booking (no-ops if Resend isn't configured).
    after(async () => {
      try {
        await sendBookingEmails(booking);
      } catch (e) {
        console.error("Booking email failed:", e);
      }
    });

    return NextResponse.json({ ok: true, id: booking.id }, { status: 201 });
  } catch (err) {
    // Unique-constraint race: someone grabbed the exact slot first.
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "That time was just taken — please pick another." },
        { status: 409 },
      );
    }
    // Most likely: DATABASE_URL not set yet.
    return NextResponse.json(
      { error: "Booking couldn't be saved — the database isn't connected yet." },
      { status: 503 },
    );
  }
}
