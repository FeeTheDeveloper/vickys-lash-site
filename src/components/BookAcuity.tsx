import { BOOK_LINK, SITE } from "@/lib/site";

/** Booking section when Acuity is the booking authority (BOOKING_MODE="acuity"). */
export default function BookAcuity() {
  return (
    <section id="book">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">Book online</span>
          <h2>Reserve your seat</h2>
          <p>
            Pick your set and time in our scheduler. A ${SITE.depositUsd} non-refundable
            deposit holds your appointment.
          </p>
        </div>
        <div className="book-shell">
          <div className="book-inner book-external">
            <ol className="book-steps">
              <li>
                <span className="b">1</span>Choose your set
              </li>
              <li>
                <span className="b">2</span>Pick a day &amp; time
              </li>
              <li>
                <span className="b">3</span>Pay the ${SITE.depositUsd} deposit
              </li>
            </ol>
            <a
              className="btn btn-primary"
              {...BOOK_LINK}
            >
              Book your set{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
            <p className="book-fine">
              Opens our booking page. Questions first? DM{" "}
              <a href={SITE.instagramUrl} target="_blank" rel="noopener">
                @{SITE.instagramHandle}
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
