import { Saira, Noto_Sans_TC } from "next/font/google";
import "normalize.css";
import "@/app/globals.css";

import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReduxProvider } from "@/app/store/provider";
import { BackgroundColorHandler } from "@/lib/BackgroundColorHandler";

const saira = Saira({
  subsets: ["latin"],
  variable: "--font-saira",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  variable: "--font-noto-sans-tc",
  display: "fallback",
});

export const metadata = {
  manifest: "/manifest.json",
  applicationName: "V-Stats",
  title: { default: "V-Stats", template: "%s | V-Stats" },
  description: "Best volleyball stats app ever",
  keywords: ["volleyball", "stats", "app", "vstats", "v-stats"],
  authors: [{ name: "V-Stats" }, { name: "Andrew Tseng" }],
  colorTheme: "light",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport = {
  themeColor: "#f6f4f5",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  width: "device-width",
  userScalable: false,
};

export default async function RootLayout({ children }) {
  return (
    <html lang="en" className={`${saira.variable} ${notoSansTC.variable}`}>
      <head>
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <meta name="apple-mobile-web-app-title" content="V-Stats" />
        {/* apple touch icons */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/icons/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon-180x180.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/icons/apple-touch-icon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/icons/apple-touch-icon-120x120.png"
        />

        {/* open graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="V-Stats" />
        <meta property="og:site_name" content="V-Stats" />
        <meta
          property="og:description"
          content="Best volleyball stats app ever"
        />
        {/* TODO: 尚未補上 og 圖片 */}

        {/* TODO: twitter 設定待補 */}
        {/* TODO: apple splash screen images 待補 */}
      </head>
      <body>
        <ReduxProvider>{children}</ReduxProvider>
        <BackgroundColorHandler />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
