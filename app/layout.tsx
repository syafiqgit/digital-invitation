import type { Metadata } from "next";
import { headers } from "next/headers";
import {
  Geist,
  Geist_Mono,
  Great_Vibes,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";

const greatVibes = Great_Vibes({
  weight: "400",
  variable: "--font-script",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  variable: "--font-serif",
  subsets: ["latin"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const COUPLE = "Talitha & Regga";
const WEDDING_DATE = "12 Desember 2026";
const LOCATION = "Jakarta";

function formatGuestName(raw: string) {
  return decodeURIComponent(raw)
    .replace(/[-+]/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const guestRaw = headersList.get("x-guest-name");
  const guest = guestRaw ? formatGuestName(guestRaw) : null;

  const title = guest
    ? `${COUPLE} invites ${guest}`
    : `${COUPLE} | The Wedding Invitation`;

  const description = guest
    ? `Kepada ${guest}, kami mengundang Anda hadir di pernikahan kami, ${WEDDING_DATE} di ${LOCATION}. Mohon doa restu dan kehadirannya.`
    : `Undangan pernikahan ${COUPLE}, ${WEDDING_DATE} di ${LOCATION}. Mohon doa restu dan kehadirannya.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ["/og-image.jpg"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/og-image.jpg"],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} ${greatVibes.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-serif">{children}</body>
    </html>
  );
}
