// =========================================================================
// Vicky's Lash Lab — brand + business facts, in one place.
// Only put VERIFIED details here: everything on the public site reads from it.
// =========================================================================

export const SITE = {
  name: "Vicky's Lash Lab",
  // Canonical URL. Set NEXT_PUBLIC_SITE_URL once the final domain is connected.
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://vickys-lash-site.vercel.app",
  location: "Dallas, TX",
  instagramHandle: "vickyslabco",
  instagramUrl: "https://www.instagram.com/vickyslabco/",
  depositUsd: 16,
  // Acuity scheduler — every "Book" CTA goes here in acuity mode.
  acuityUrl: "https://vickyslashlab.as.me/schedule/e7057bf0",
};

/**
 * One booking authority, never both — running two calendars side by side
 * risks double-booking. "acuity" (default) sends every booking CTA to the
 * Acuity scheduler and disables the in-house booking API. Set
 * NEXT_PUBLIC_BOOKING_MODE=inhouse only after Acuity is retired.
 */
export const BOOKING_MODE: "acuity" | "inhouse" =
  process.env.NEXT_PUBLIC_BOOKING_MODE === "inhouse" ? "inhouse" : "acuity";

/** Flip to true once Vicky has confirmed every price in SERVICES (schedule.ts). */
export const PRICES_CONFIRMED = false;

/** Where every "Book your set" CTA points, plus link attrs for external targets. */
export const BOOK_LINK =
  BOOKING_MODE === "acuity"
    ? { href: SITE.acuityUrl, target: "_blank", rel: "noopener" }
    : { href: "#book" };
