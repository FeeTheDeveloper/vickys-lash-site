import Image from "next/image";

const INSTAGRAM = "https://instagram.com/vickyslashlab";

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
              Lashes &amp; brows, done in the lab. Booked online, glowing in person.
            </p>
          </div>
          <div className="foot-col">
            <h4>Visit</h4>
            {/* EDIT: real details */}
            <a href="tel:+15550000000">(555) 000-0000</a>
            <a href="mailto:hello@vickyslashlab.com">hello@vickyslashlab.com</a>
            <p>
              123 Glow Ave
              <br />
              Your City, ST 00000
            </p>
          </div>
          <div className="foot-col">
            <h4>Hours</h4>
            {/* EDIT: keep in sync with HOURS in src/lib/schedule.ts */}
            <p>Tue–Fri · 10a–6p</p>
            <p>Sat · 9a–3p</p>
            <p>Sun–Mon · Closed</p>
            <a href={INSTAGRAM} target="_blank" rel="noopener">
              @vickyslashlab →
            </a>
          </div>
        </div>
        <div className="foot-bottom">
          <span>© {year} Vicky&apos;s Lash Lab</span>
          <span>Booked in-house · vickyslashlab.com</span>
        </div>
      </div>
    </footer>
  );
}
