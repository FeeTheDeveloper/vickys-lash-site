import Image from "next/image";
import { BOOK_LINK, SITE } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer>
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <a className="brand" href="#top" aria-label="Vicky's Lash Lab home">
              <Image
                src="/logo.png"
                alt="Vicky's Lash Lab"
                width={200}
                height={200}
                className="brand-logo foot-logo"
              />
            </a>
            <p className="foot-blurb">
              Custom lash sets, mapped to your eyes. Appointment only in {SITE.location}.
            </p>
          </div>
          <div className="foot-col">
            <h4>Studio</h4>
            <p>{SITE.location}</p>
            <p>Appointment only</p>
            <p>${SITE.depositUsd} non-refundable deposit to book</p>
          </div>
          <div className="foot-col">
            <h4>Connect</h4>
            <a {...BOOK_LINK}>
              Book your set →
            </a>
            <a href={SITE.instagramUrl} target="_blank" rel="noopener">
              @{SITE.instagramHandle} →
            </a>
            <p>Questions? DM us on Instagram.</p>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} Vicky&apos;s Lash Lab</span>
          <span>{SITE.location} · Appointment only</span>
        </div>
      </div>
    </footer>
  );
}
