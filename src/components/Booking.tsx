"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  MO,
  SERVICES,
  WD,
  label,
  money,
  type DayAvailability,
  type Service,
} from "@/lib/schedule";

const STEP_NAMES = ["Service", "Day", "Time", "Details", "Done"];

type Form = { name: string; email: string; phone: string; website: string };
const EMPTY_FORM: Form = { name: "", email: "", phone: "", website: "" };

const newKey = () =>
  typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 12)}`;

export default function Booking() {
  const [step, setStep] = useState(1);
  const [service, setService] = useState<Service | null>(null);
  const [days, setDays] = useState<DayAvailability[]>([]);
  const [loadingAvail, setLoadingAvail] = useState(false);
  const [dateISO, setDateISO] = useState<string | null>(null);
  const [start, setStart] = useState<number | null>(null);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<{ firstName: string } | null>(null);

  const sectionRef = useRef<HTMLElement | null>(null);
  const didMount = useRef(false);
  // One key per booking attempt so a double-submit can only create one booking.
  const idemKey = useRef<string>("");

  // Scroll the booking card into view on step change (but not on first render).
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [step]);

  const loadAvailability = useCallback(async (svc: Service) => {
    setLoadingAvail(true);
    setError(null);
    try {
      const res = await fetch(`/api/availability?serviceId=${svc.id}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setDays(res.ok ? (data.days ?? []) : []);
    } catch {
      setDays([]);
    } finally {
      setLoadingAvail(false);
    }
  }, []);

  function chooseService(svc: Service) {
    setService(svc);
    setDateISO(null);
    setStart(null);
    setStep(2);
    loadAvailability(svc);
  }

  function chooseDate(date: string) {
    setDateISO(date);
    setStart(null);
    setStep(3);
  }

  function chooseTime(t: number) {
    setStart(t);
    setError(null);
    setStep(4);
  }

  const daySlots = dateISO
    ? (days.find((d) => d.date === dateISO)?.slots ?? [])
    : [];

  async function submit() {
    if (!service || !dateISO || start === null) return;
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.phone.trim();
    if (!name || !(email || phone)) {
      setError("Add your name and an email or phone so Vicky can confirm.");
      return;
    }
    if (!idemKey.current) idemKey.current = newKey();
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          date: dateISO,
          start,
          name,
          email,
          phone,
          website: form.website,
          idempotencyKey: idemKey.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong — please try again.");
        // Slot was taken — refresh availability and bounce back to time picker.
        if (res.status === 409) {
          idemKey.current = "";
          await loadAvailability(service);
          setStart(null);
          setStep(3);
        }
        return;
      }
      idemKey.current = "";
      setConfirmed({ firstName: name.split(" ")[0] });
      setStep(5);
    } catch {
      setError("Network hiccup — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  function reset() {
    setService(null);
    setDays([]);
    setDateISO(null);
    setStart(null);
    setForm(EMPTY_FORM);
    setError(null);
    setConfirmed(null);
    idemKey.current = "";
    setStep(1);
  }

  const dateObj = dateISO ? new Date(dateISO + "T00:00:00") : null;

  const SummaryRows = () =>
    service && dateObj && start !== null ? (
      <>
        <div className="r">
          <span>Service</span>
          <span>{service.name}</span>
        </div>
        <div className="r">
          <span>Date</span>
          <span>
            {WD[dateObj.getDay()]}, {MO[dateObj.getMonth()]} {dateObj.getDate()}
          </span>
        </div>
        <div className="r">
          <span>Time</span>
          <span>
            {label(start)} – {label(start + service.dur)}
          </span>
        </div>
        <div className="r">
          <span>Price</span>
          <span>{money(service.price)}</span>
        </div>
      </>
    ) : null;

  return (
    <section id="book" ref={sectionRef}>
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Book online</span>
          <h2>Reserve your seat</h2>
          <p>Pick a service, day, and time. Vicky confirms every appointment personally.</p>
        </div>

        <div className="book-shell">
          <div className="book-inner">
            <div className="steps-bar" aria-hidden="true">
              {STEP_NAMES.map((n, i) => {
                const idx = i + 1;
                const cls =
                  idx === step ? "active" : idx < step ? "done" : "";
                return (
                  <span key={n} className={`pstep ${cls}`}>
                    <span className="b">{idx < step ? "✓" : idx}</span>
                    {n}
                  </span>
                );
              })}
            </div>

            {/* STEP 1 — service */}
            {step === 1 && (
              <div className="panel">
                <h3>Choose a service</h3>
                <p className="sub">What are we doing today?</p>
                <div className="opt-list">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className={`opt ${service?.id === s.id ? "sel" : ""}`}
                      onClick={() => chooseService(s)}
                    >
                      <span>
                        <span className="nm">{s.name}</span>
                        <span className="mt">{s.dur} min</span>
                      </span>
                      <span className="pr">{money(s.price)}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 2 — day */}
            {step === 2 && (
              <div className="panel">
                <h3>Pick a day</h3>
                <p className="sub">
                  {loadingAvail
                    ? "Checking the calendar…"
                    : `Next available dates · ${service?.name ?? ""}`}
                </p>
                {loadingAvail ? (
                  <div className="empty">Loading availability…</div>
                ) : days.length ? (
                  <div className="chips">
                    {days.map((d) => {
                      const dd = new Date(d.date + "T00:00:00");
                      return (
                        <button
                          key={d.date}
                          type="button"
                          className={`chip ${dateISO === d.date ? "sel" : ""}`}
                          onClick={() => chooseDate(d.date)}
                        >
                          <div className="wd">{WD[dd.getDay()]}</div>
                          <div className="dy">{dd.getDate()}</div>
                          <div className="mo">{MO[dd.getMonth()]}</div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty">
                    No open days in the next few weeks — DM us on Instagram and we&apos;ll find you a time.
                  </div>
                )}
                <div className="nav-row">
                  <button className="link-back" type="button" onClick={() => setStep(1)}>
                    ← Service
                  </button>
                  <span />
                </div>
              </div>
            )}

            {/* STEP 3 — time */}
            {step === 3 && (
              <div className="panel">
                <h3>Pick a time</h3>
                <p className="sub">
                  {dateObj && service
                    ? `${WD[dateObj.getDay()]}, ${MO[dateObj.getMonth()]} ${dateObj.getDate()} · ${service.name}`
                    : "Available start times."}
                </p>
                {daySlots.length ? (
                  <div className="slots">
                    {daySlots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        className={`slot ${start === t ? "sel" : ""}`}
                        onClick={() => chooseTime(t)}
                      >
                        {label(t)}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="empty">No open times that day — try another date.</div>
                )}
                <div className="nav-row">
                  <button className="link-back" type="button" onClick={() => setStep(2)}>
                    ← Day
                  </button>
                  <span />
                </div>
              </div>
            )}

            {/* STEP 4 — details */}
            {step === 4 && (
              <div className="panel">
                <h3>Your details</h3>
                <p className="sub">So Vicky can confirm and send reminders.</p>
                <div className="summary">
                  <SummaryRows />
                </div>
                <div className="field">
                  <label htmlFor="f-name">Full name</label>
                  <input
                    id="f-name"
                    type="text"
                    placeholder="First and last"
                    autoComplete="name"
                    maxLength={80}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-email">Email</label>
                  <input
                    id="f-email"
                    type="email"
                    placeholder="you@email.com"
                    autoComplete="email"
                    maxLength={254}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="field">
                  <label htmlFor="f-phone">Phone</label>
                  <input
                    id="f-phone"
                    type="tel"
                    placeholder="(000) 000-0000"
                    autoComplete="tel"
                    maxLength={25}
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                </div>
                {/* Honeypot — hidden from people, filled by bots. */}
                <div className="hp" aria-hidden="true">
                  <label htmlFor="f-website">Website</label>
                  <input
                    id="f-website"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
                {error && <div className="form-err">{error}</div>}
                <div className="nav-row">
                  <button className="link-back" type="button" onClick={() => setStep(3)}>
                    ← Time
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                  >
                    {submitting ? "Booking…" : "Confirm booking"}
                    {!submitting && (
                      <span className="arrow" aria-hidden="true">
                        →
                      </span>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 5 — confirmed */}
            {step === 5 && (
              <div className="panel">
                <div className="confirm">
                  <div className="tick" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  </div>
                  <h3>Request received!</h3>
                  <p>
                    {confirmed && service
                      ? `${confirmed.firstName}, your ${service.name.toLowerCase()} is on the calendar. Vicky will confirm with you directly.`
                      : "See you soon."}
                  </p>
                  <div className="summary" style={{ textAlign: "left", marginTop: 20 }}>
                    <SummaryRows />
                    {confirmed && (
                      <div className="r">
                        <span>Name</span>
                        <span>{form.name}</span>
                      </div>
                    )}
                  </div>
                  <button
                    className="btn btn-ghost"
                    type="button"
                    onClick={reset}
                    style={{ marginTop: 6 }}
                  >
                    Book another
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
