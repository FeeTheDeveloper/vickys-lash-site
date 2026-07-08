import type { Metadata, Viewport } from "next";
import { Syne, Sora, Kaushan_Script } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});
const kaushan = Kaushan_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-kaushan",
  display: "swap",
});

const SITE_URL = "https://vickyslashlab.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Vicky's Lash Lab — Lashes & Brows · Book online",
  description:
    "Lashes and brows, done in the lab. Book your appointment with Vicky's Lash Lab online — real-time availability, no phone tag.",
  keywords: ["lashes", "brows", "lash lab", "eyelash extensions", "brow lamination", "book online"],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Vicky's Lash Lab — Lashes & Brows",
    description: "Custom sets, clean fills, sculpted brows. Book your slot in real time.",
    url: SITE_URL,
    siteName: "Vicky's Lash Lab",
    images: [{ url: "/logo.png", width: 1024, height: 1024, alt: "Vicky's Lash Lab" }],
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#080209",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${sora.variable} ${kaushan.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
