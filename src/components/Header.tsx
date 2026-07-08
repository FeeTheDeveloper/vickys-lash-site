import Image from "next/image";

// EDIT: real Instagram URL
const INSTAGRAM = "https://instagram.com/vickyslashlab";

export default function Header() {
  return (
    <header>
      <div className="wrap nav">
        <a className="brand" href="#top" aria-label="Vicky's Lash Lab home">
          <Image
            src="/logo.png"
            alt="Vicky's Lash Lab"
            width={200}
            height={200}
            className="brand-logo"
            priority
          />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#services">Services</a>
          <a href="#gallery">Gallery</a>
          <a href="#book">Book</a>
        </nav>
        <div className="nav-cta">
          <a
            className="ig"
            href={INSTAGRAM}
            target="_blank"
            rel="noopener"
            aria-label="Instagram"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4" />
              <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
            </svg>
          </a>
          <a className="btn btn-primary" href="#book">
            Book now
          </a>
        </div>
      </div>
    </header>
  );
}
