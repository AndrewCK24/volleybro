import { Inter, Saira, Noto_Sans_TC } from "next/font/google";
import StyledComponentsRegistry from "./lib/registry";
import "./globals.css";

import Root from "./components/layout/Root";

const inter = Inter({ subsets: ["latin"] });
const saira = Saira({ subsets: ["latin"] });
const notoSansTC = Noto_Sans_TC({ subsets: ["latin"] });

export const metadata = {
  manifest: "/manifest.json",
  applicationName: "V-Stats",
  title: { default: "V-Stats", template: "%s | V-Stats" },
  description: "Best volleyball stats app ever",
  keywords: ["volleyball", "stats", "app", "vstats", "v-stats"],
  authors: [{ name: "V-Stats" }, { name: "Andrew Tseng" }],
  colorTheme: "light",
  themeColor: "#dddcdd",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
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

        <link
          href="https://fonts.googleapis.com/css2?family=Saira:wght@400;500;700&family=Orbitron:wght@400;500;700&family=Inter:wght@400;500;700&family=Noto+Sans+TC:wght@400;500;700&display=swap"
          rel="stylesheet"
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
        <StyledComponentsRegistry>
          <Root>
          {children}
          </Root>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
