import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import type { ReactNode } from "react";

import { theme } from "@/theme";

import "./globals.css";

export const metadata: Metadata = {
  title: "食神Wiki",
};

const notoSansJp = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            {children}
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
