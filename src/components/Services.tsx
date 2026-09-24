import { SERVICES, money } from "@/lib/schedule";
import { BOOK_LINK, BOOKING_MODE, PRICES_CONFIRMED, SITE } from "@/lib/site";
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
            Every set starts with a quick consult and custom mapping, so your lashes
            fit your eye shape and your routine.
          </p>
        </div>
        <div className="svc-grid">
          {menu.map((s, i) => (
            <Reveal key={s.id} className="svc" delay={(i % 2) * 80}>
              <div className="info">
                <h3>{s.name}</h3>
                <div className="meta">{s.dur} min</div>
              </div>
              {PRICES_CONFIRMED && (
                <div className="price grad-text">{money(s.price)}</div>
              )}
            </Reveal>
          ))}
        </div>
        <div className="svc-cta">
          <a className="btn btn-primary" {...BOOK_LINK}>
            Book your set{" "}
            <span className="arrow" aria-hidden="true">
              →
            </span>
          </a>
          <span className="svc-note">
            {!PRICES_CONFIRMED && "Current pricing is shown when you book. "}
            {BOOKING_MODE === "inhouse"
              ? `Not sure which set? Pick "Not sure yet" at booking and Vicky will guide you.`
              : `Not sure which set? DM @${SITE.instagramHandle} and Vicky will guide you.`}
          </span>
        </div>
      </div>
    </section>
  );
}
