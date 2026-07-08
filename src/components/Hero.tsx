import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="ring" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-inner">
          <div className="eyebrow">
            <span className="pip" aria-hidden="true" /> Lashes &amp; Brows Studio
          </div>
          <h1>
            Lashes &amp; brows,
            <br />
            done in the <span className="glow">lab.</span>
          </h1>
          <p className="lede">
            Custom sets, clean fills, sculpted brows. Book your slot in real time —
            no DMs, no phone tag, no waiting on a reply.
          </p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#book">
              Book your appointment{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
            <a className="btn btn-ghost" href="#services">
              View services
            </a>
          </div>
          <div className="hero-strip">
            <div className="item">
              <div className="n">Real-time</div>
              <div className="k">Online booking</div>
            </div>
            <div className="item">
              <div className="n">Custom</div>
              <div className="k">Every set</div>
            </div>
            <div className="item">
              <div className="n">By Vicky</div>
              <div className="k">Lash &amp; brow artist</div>
            </div>
          </div>
        </div>
        <div className="hero-logo-wrap">
          <Image
            src="/logo.png"
            alt="Vicky's Lash Lab — Lashes & Brows logo"
            width={440}
            height={440}
            className="hero-logo"
            priority
          />
        </div>
      </div>
    </section>
  );
}
