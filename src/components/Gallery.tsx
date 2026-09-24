import Image from "next/image";
import Reveal from "./Reveal";
import { SITE } from "@/lib/site";

// Approved client-work photos only (aim for 8–12). Put the files in
// /public/work and list them here — all are shown square for a consistent grid.
// While this list is empty the section points visitors to Instagram instead.
const WORK: { src: string; alt: string; label: string }[] = [];

export default function Gallery() {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">The work</span>
          <h2>Fresh from the lab</h2>
          <p>Every set is mapped to the eye it&apos;s on. Here&apos;s the proof.</p>
        </div>
        {WORK.length ? (
          <div className="gal">
            {WORK.map((w, i) => (
              <Reveal key={w.src} className="cell" delay={(i % 4) * 70}>
                <Image
                  src={w.src}
                  alt={w.alt}
                  fill
                  sizes="(max-width: 860px) 50vw, 25vw"
                  className="cell-img"
                />
                <span className="cell-label">{w.label}</span>
              </Reveal>
            ))}
          </div>
        ) : (
          <Reveal className="gal-empty">
            <p>New sets post to Instagram first.</p>
            <a
              className="btn btn-ghost"
              href={SITE.instagramUrl}
              target="_blank"
              rel="noopener"
            >
              See the work on @{SITE.instagramHandle}{" "}
              <span className="arrow" aria-hidden="true">
                →
              </span>
            </a>
          </Reveal>
        )}
      </div>
    </section>
  );
}
