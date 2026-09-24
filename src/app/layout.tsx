import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Sora } from "next/font/google";
import { SITE } from "@/lib/site";
import "./globals.css";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-bodoni",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sora",
  display: "swap",
});

const DESCRIPTION =
  "Custom lash sets in Dallas, designed for your eye shape, your lifestyle, and your moment. Appointment only — book your set online.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: "Vicky's Lash Lab — Custom Lash Sets in Dallas, TX",
  description: DESCRIPTION,
  keywords: [
    "lash extensions Dallas",
    "lash clusters Dallas",
    "custom lash mapping",
    "Vicky's Lash Lab",
  ],
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Vicky's Lash Lab — Lashes, engineered for your eyes.",
    description: DESCRIPTION,
    url: SITE.url,
    siteName: SITE.name,
    locale: "en_US",
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
      className={`${bodoni.variable} ${sora.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
