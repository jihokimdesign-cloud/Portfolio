import type { Metadata } from "next";
import { Manrope, DM_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import LoadingScreen from "@/components/LoadingScreen";
import ScrollToTop from "@/components/ScrollToTop";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  subsets: ["latin"],
  variable: "--font-dm-mono",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jiho's Canvas",
  description:
    "Product Designer creating user-centered digital products across enterprise SaaS, AI platforms, and consumer applications.",
  keywords: [
    "Jiho Kim",
    "Product Designer",
    "UX Researcher",
    "Portfolio",
    "University of Washington",
    "Figma",
    "Design Systems",
  ],
  authors: [{ name: "Jiho Kim" }],
  openGraph: {
    title: "Jiho Kim, Product Designer",
    description:
      "Product Designer. Reduced user friction by 40%, boosted engagement by 167%.",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/Thumbnail portfolio.png",
        width: 1200,
        height: 630,
        alt: "Jiho Kim — Product Designer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jiho Kim, Product Designer",
    description:
      "Product Designer crafting user-centered digital experiences.",
    images: ["/Thumbnail portfolio.png"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/heart-me.png.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/heart-me.png.png" type="image/png" />
        <link rel="apple-touch-icon" href="/heart-me.png.png" />
      </head>
      <body className={`${manrope.variable} ${dmMono.variable} ${instrumentSerif.variable} antialiased`}>
        <Analytics />
        <LoadingScreen />
        <ScrollToTop />
        <a href="#main" className="skip-link">
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
