import type { Metadata } from "next";
import { Baloo_Bhai_2 } from "next/font/google";

import "./globals.css";

/**
 * The one family this site uses. main.css used to pull six families from
 * fonts.googleapis.com through a render-blocking CSS @import; next/font
 * self-hosts just this one and exposes it as --font-baloo, which main.css
 * now references.
 */
const baloo = Baloo_Bhai_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-baloo",
});

export const metadata: Metadata = {
  // Needed for absolute OG/Twitter image URLs. Set NEXT_PUBLIC_SITE_URL in the
  // deployment env; the localhost fallback keeps dev working.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Crimson Deli · Fresh Food Pickup & Everyday Essentials",
    template: "%s · Crimson Deli",
  },
  description:
    "Hoagies, deli sandwiches, fruit bowls and smoothies made fresh at Crimson Deli on Ogontz Avenue. Order yours for pickup, or shop everyday essentials in-store and on DoorDash.",
  openGraph: {
    type: "website",
    siteName: "Crimson Deli",
    locale: "en_US",
    title: "Crimson Deli · Fresh Food Pickup & Everyday Essentials",
    description:
      "Fresh food made in-store for pickup at 7720 Ogontz Avenue, Philadelphia. Everyday essentials in-store or delivered on DoorDash.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Crimson Deli · Fresh Food Pickup & Everyday Essentials",
    description:
      "Fresh food made in-store for pickup at 7720 Ogontz Avenue, Philadelphia. Everyday essentials in-store or delivered on DoorDash.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Browser extensions stamp attributes onto <html> and <body> before React
    // hydrates — LanguageTool adds data-lt-installed, ColorZilla adds
    // cz-shortcut-listen. suppressHydrationWarning does not cascade, so both
    // elements need it or the extension noise is reported as an app mismatch.
    <html lang="en" className={baloo.variable} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
