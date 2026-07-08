import Reveal from "./Reveal";

// EDIT: replace these placeholder labels with real photos of Vicky's work.
// To use images, swap the <div className="cell"> for a next/image inside the cell.
const WORK = ["Classic set", "Volume set", "Brow lam", "Hybrid fill"];

export default function Gallery() {
  return (
    <section id="gallery">
      <div className="wrap">
        <div className="sec-head">
          <span className="eyebrow">The work</span>
          <h2>Fresh from the lab</h2>
          <p>
            EDIT: drop in real photos of Vicky&apos;s lash &amp; brow work — this is
            where the Instagram energy lives.
          </p>
        </div>
        <div className="gal" aria-label="Gallery placeholders">
          {WORK.map((label, i) => (
            <Reveal key={label} className="cell" delay={i * 70}>
              {label}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
