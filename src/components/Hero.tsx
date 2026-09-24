import Image from "next/image";
import { BOOK_LINK, SITE } from "@/lib/site";

// Drop a licensed / client-supplied macro lash photo in /public and set its
// path here (e.g. "/hero.jpg"). Until then the hero shows a lash-mapping panel.
const HERO_IMAGE: string | null = null;

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-media" aria-hidden={!HERO_IMAGE}>
        {HERO_IMAGE ? (
          <Image
            src={HERO_IMAGE}
            alt="Close-up of a custom lash set by Vicky's Lash Lab"
            fill
            priority
            sizes="(max-width: 860px) 100vw, 60vw"
            className="hero-photo"
          />
        ) : (
          <MappingArt />
        )}
      </div>

      <div className="wrap hero-grid">
        <div className="hero-inner">
          <div className="eyebrow hero-eyebrow">
            Beauty <span aria-hidden="true">×</span> Science{" "}
            <span aria-hidden="true">×</span> You
            <span className="rule" aria-hidden="true" />
          </div>
          <h1>
            Lashes,
            <br />
            <span className="accent">engineered</span>
            <br />
            for your eyes.
          </h1>
          <p className="lede">
            Custom lash sets in Dallas—designed for your eye shape, your
            lifestyle, and your moment.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" {...BOOK_LINK}>
              Book your set{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a className="btn btn-ghost" href="#gallery">
              View the work
            </a>
          </div>
        </div>
      </div>

      <div className="hero-strip">
        <div className="wrap hero-strip-row">
          <div className="item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            {SITE.location}
          </div>
          <div className="item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M3 10c4.5 4 13.5 4 18 0" />
              <path d="M6 12.6l-1.4 2.6M9.3 13.8l-.6 2.9M12 14.1V17M14.7 13.8l.6 2.9M18 12.6l1.4 2.6" />
            </svg>
            Custom mapping
          </div>
          <div className="item">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <rect x="3.5" y="5" width="17" height="15" rx="2" />
              <path d="M3.5 10h17M8 3v4M16 3v4" />
            </svg>
            Online booking
          </div>
        </div>
      </div>
    </section>
  );
}

/** Fine-line lash map — stands in for photography until real work is supplied. */
function MappingArt() {
  const fans = Array.from({ length: 23 }, (_, i) => i);
  return (
    <svg className="hero-map" viewBox="0 0 600 400" fill="none">
      <defs>
        <linearGradient id="lashGrad" x1="0" x2="1">
          <stop offset="0" stopColor="#ff2d8e" />
          <stop offset="1" stopColor="#ffa84c" />
        </linearGradient>
      </defs>
      {/* eye outline */}
      <path d="M90 230 C 200 120, 400 120, 510 230 C 400 300, 200 300, 90 230 Z" stroke="rgba(255,214,236,.35)" strokeWidth="1.2" />
      <circle cx="300" cy="222" r="58" stroke="rgba(255,214,236,.28)" strokeWidth="1" />
      <circle cx="300" cy="222" r="24" stroke="rgba(255,214,236,.2)" strokeWidth="1" />
      {/* lash fans along the upper lid */}
      {fans.map((i) => {
        const t = i / (fans.length - 1);
        const x = 105 + t * 390;
        const y = 230 - Math.sin(t * Math.PI) * 88;
        const len = 34 + Math.sin(t * Math.PI) * 46;
        const ang = (-150 + t * 120) * (Math.PI / 180);
        return (
          <line
            key={i}
            x1={x}
            y1={y}
            x2={x + Math.cos(ang) * len}
            y2={y + Math.sin(ang) * len}
            stroke="url(#lashGrad)"
            strokeWidth="1.4"
            strokeLinecap="round"
          />
        );
      })}
      {/* mapping zones */}
      {[0.2, 0.45, 0.7].map((t) => {
        const x = 105 + t * 390;
        return (
          <g key={t}>
            <line x1={x} y1="60" x2={x} y2="330" stroke="rgba(255,166,213,.18)" strokeDasharray="3 6" />
            <text x={x + 6} y="74" fill="rgba(255,214,236,.5)" fontSize="11" letterSpacing="2">
              {t === 0.2 ? "9MM" : t === 0.45 ? "11MM" : "12MM"}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
