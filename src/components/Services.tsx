import { SERVICES, money } from "@/lib/schedule";
import Reveal from "./Reveal";

export default function Services() {
  const menu = SERVICES.filter((s) => s.id !== "unsure");

  return (
    <section id="services">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">The menu</span>
          <h2>Pick your look</h2>
          <p>
            EDIT: swap these for Vicky&apos;s real services, durations, and prices —
            the booking system reads straight from this list.
          </p>
        </div>
        <div className="svc-grid">
          {menu.map((s, i) => (
            <Reveal key={s.id} className="svc" delay={(i % 2) * 80}>
              <div className="info">
                <h3>{s.name}</h3>
                <div className="meta">{s.dur} min</div>
              </div>
              <div className="price grad-text">{money(s.price)}</div>
            </Reveal>
          ))}
        </div>
        <div className="svc-cta">
          <a className="btn btn-primary" href="#book">
            Book any service{" "}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
          <span className="svc-note">
            Not sure which set? Pick &quot;Not sure yet&quot; at booking and Vicky
            will guide you.
          </span>
        </div>
      </div>
    </section>
  );
}
