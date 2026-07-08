// =========================================================================
// Vicky's Lash Lab — scheduling engine (shared by server API + client UI)
// EDIT #1: SERVICES.  EDIT #2: HOURS.  Everything else is engine.
// =========================================================================

export type Service = {
  id: string;
  name: string;
  dur: number; // minutes
  price: number; // dollars; 0 renders as "Consult"
};

// EDIT #1 — Vicky's real services, durations (min), and prices.
export const SERVICES: Service[] = [
  { id: "classic", name: "Classic Full Set", dur: 120, price: 120 },
  { id: "hybrid", name: "Hybrid Full Set", dur: 135, price: 140 },
  { id: "volume", name: "Volume Full Set", dur: 150, price: 160 },
  { id: "fill2", name: "Lash Fill · 2 week", dur: 60, price: 55 },
  { id: "fill3", name: "Lash Fill · 3 week", dur: 75, price: 70 },
  { id: "browlam", name: "Brow Lamination", dur: 45, price: 65 },
  { id: "browtint", name: "Brow Shape & Tint", dur: 30, price: 40 },
  { id: "unsure", name: "Not sure yet", dur: 60, price: 0 },
];

// EDIT #2 — open hours as [open, close] in minutes-from-midnight; null = closed.
// 0=Sun 1=Mon 2=Tue 3=Wed 4=Thu 5=Fri 6=Sat.  600 = 10:00, 1080 = 18:00.
export const HOURS: Record<number, [number, number] | null> = {
  0: null,
  1: null,
  2: [600, 1080],
  3: [600, 1080],
  4: [600, 1080],
  5: [600, 1080],
  6: [540, 900],
};

export const SLOT_STEP = 30; // minutes between candidate start times
export const DAYS_AHEAD = 28; // how far out bookings are allowed

export const WD = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const MO = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export const getService = (id: string) => SERVICES.find((s) => s.id === id);

const pad = (n: number) => String(n).padStart(2, "0");

/** Local YYYY-MM-DD for a Date. */
export const iso = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Minutes-from-midnight -> "1:30 PM". */
export function label(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  const ap = h >= 12 ? "PM" : "AM";
  const hh = h % 12 || 12;
  return `${hh}:${pad(m)} ${ap}`;
}

export const money = (n: number) => (n === 0 ? "Consult" : "$" + n);

export type Interval = { start: number; end: number };

/**
 * Open start times for a given day + service, excluding clashes with existing
 * bookings and (for today) past/too-soon slots. Pure — takes booked intervals in.
 */
export function daySlots(
  dateISO: string,
  service: Service,
  booked: Interval[],
  now: Date,
): number[] {
  const d = new Date(dateISO + "T00:00:00");
  const hrs = HOURS[d.getDay()];
  if (!hrs) return [];
  const [open, close] = hrs;
  const isToday = iso(now) === dateISO;
  const nowMin = now.getHours() * 60 + now.getMinutes();
  const out: number[] = [];
  for (let t = open; t + service.dur <= close; t += SLOT_STEP) {
    if (isToday && t <= nowMin + 15) continue;
    const clash = booked.some((b) => t < b.end && t + service.dur > b.start);
    if (!clash) out.push(t);
  }
  return out;
}

export type DayAvailability = { date: string; slots: number[] };
