// Booking emails via Resend (https://resend.com). Uses the REST API directly —
// no extra dependency. If RESEND_API_KEY / BOOKING_FROM_EMAIL aren't set, this
// no-ops so bookings still work without email configured.

import { MO, WD, label, money } from "@/lib/schedule";

export type BookingEmailData = {
  service: string;
  price: number;
  date: string; // YYYY-MM-DD
  start: number; // minutes from midnight
  end: number;
  name: string;
  email: string | null;
  phone: string | null;
};

function formatWhen(b: BookingEmailData) {
  const d = new Date(b.date + "T00:00:00");
  const day = `${WD[d.getDay()]}, ${MO[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  const time = `${label(b.start)} – ${label(b.end)}`;
  return { day, time };
}

const PINK = "#ff3d9a";
const BG = "#0d0410";
const CARD = "#160a17";

function shell(title: string, bodyRows: string, intro: string) {
  return `
  <div style="background:${BG};padding:32px 0;font-family:Arial,Helvetica,sans-serif;color:#fff">
    <div style="max-width:520px;margin:0 auto;padding:0 20px">
      <div style="font-size:20px;font-weight:800;letter-spacing:.12em;color:${PINK};text-align:center;margin-bottom:6px">
        VICKY&#39;S LASH LAB
      </div>
      <div style="text-align:center;color:#c9a2bd;font-size:12px;letter-spacing:.18em;text-transform:uppercase;margin-bottom:24px">
        Lashes &amp; Brows
      </div>
      <h1 style="font-size:22px;margin:0 0 8px;text-align:center">${title}</h1>
      <p style="color:#c9a2bd;text-align:center;margin:0 0 24px">${intro}</p>
      <div style="background:${CARD};border:1px solid rgba(255,120,180,.2);border-radius:14px;padding:18px 20px">
        ${bodyRows}
      </div>
      <p style="color:#8e6f86;font-size:12px;text-align:center;margin-top:24px">
        Vicky&#39;s Lash Lab · booked online at vickyslashlab.com
      </p>
    </div>
  </div>`;
}

function row(k: string, v: string) {
  return `<div style="display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid rgba(255,120,180,.1);font-size:14px">
    <span style="color:#8e6f86">${k}</span><span style="font-weight:600;text-align:right">${v}</span>
  </div>`;
}

/** Sends a confirmation to the client and a heads-up to the studio. Safe to await. */
export async function sendBookingEmails(b: BookingEmailData) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.BOOKING_FROM_EMAIL;
  if (!key || !from) return; // email not configured — skip silently

  const studio = process.env.STUDIO_NOTIFY_EMAIL;
  const { day, time } = formatWhen(b);
  const details =
    row("Service", b.service) +
    row("Date", day) +
    row("Time", time) +
    row("Price", money(b.price));

  const messages: { to: string[]; subject: string; html: string }[] = [];

  if (b.email) {
    messages.push({
      to: [b.email],
      subject: `You're booked — ${b.service}`,
      html: shell(
        "You're booked! 💖",
        details,
        `${b.name.split(" ")[0]}, your appointment is locked in. See you at the lab!`,
      ),
    });
  }

  if (studio) {
    const contact =
      row("Client", b.name) +
      (b.email ? row("Email", b.email) : "") +
      (b.phone ? row("Phone", b.phone) : "");
    messages.push({
      to: [studio],
      subject: `New booking · ${b.service} · ${day} ${label(b.start)}`,
      html: shell("New booking ✨", details + contact, "A new appointment just came in."),
    });
  }

  await Promise.all(
    messages.map((m) =>
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ from, ...m }),
      }),
    ),
  );
}
