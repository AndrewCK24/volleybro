import { Saira, Noto_Sans_TC } from "next/font/google";
import "normalize.css";
import "@/src/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { ReduxProvider } from "@/src/app/store/provider";
import { SessionProvider } from "next-auth/react";
import { Toaster } from "@/src/components/ui/toaster";
import { BackgroundColorHandler } from "@/src/components/layout/bg-handler";

const APP_NAME = "VolleyBro";
const APP_DEFAULT_TITLE = "VolleyBro";
const APP_TITLE_TEMPLATE = "%s | VolleyBro";
const APP_DESCRIPTION = "Best volleyball stats app ever.";
const AUTHOR = "Andrew Tseng";

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
  applicationName: APP_NAME,
  title: { default: APP_DEFAULT_TITLE, template: APP_TITLE_TEMPLATE },
  description: APP_DESCRIPTION,
  keywords: ["volleyball", "stats", "app", "volleybro", "VolleyBro"],
  authors: [{ name: APP_NAME }, { name: AUTHOR }],
  colorTheme: "light",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
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
        <link rel="icon" href="/favicon.ico" sizes="any" />
        {/* apple touch icons, learn more: https://developer.apple.com/design/human-interface-guidelines/app-icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link
          rel="apple-touch-icon"
          sizes="76x76"
          href="/apple-touch-icon-76x76.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="114x114"
          href="/apple-touch-icon-114x114.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="120x120"
          href="/apple-touch-icon-120x120.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="144x144"
          href="/apple-touch-icon-144x144.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="152x152"
          href="/apple-touch-icon-152x152.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="167x167"
          href="/apple-touch-icon-167x167.png"
        />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon-180x180.png"
        />

        {/* apple splash screen images */}
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/750x1334_2x.png"
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/828x1792_2x.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1080x1920_3x.png"
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1125x2436_3x.png"
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1170x2532_3x.png"
          media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1179x2556_3x.png"
          media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1242x2688_3x.png"
          media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1284x2778_3x.png"
          media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />
        <link
          rel="apple-touch-startup-image"
          href="/apple-splash/1290x2796_3x.png"
          media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
        />

        <meta property="og:type" content="website" />
        <meta property="og:title" content="VolleyBro" />
        <meta property="og:site_name" content="VolleyBro" />
        <meta
          property="og:description"
          content="Best volleyball stats app ever"
        />
        {/* TODO: 尚未補上 og 圖片 */}
        {/* TODO: twitter 設定待補 */}
      </head>
      <body>
        <SessionProvider>
          <ReduxProvider>
            {children}
            <Toaster />
          </ReduxProvider>
        </SessionProvider>
        <BackgroundColorHandler />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
