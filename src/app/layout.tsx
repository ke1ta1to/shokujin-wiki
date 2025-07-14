import { CssBaseline, ThemeProvider } from "@mui/material";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Noto_Sans_JP } from "next/font/google";

import { AppLayout } from "@/components/app-layout";
import { theme } from "@/theme";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-noto-sans-jp",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja" className={notoSansJp.variable}>
      <body>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppLayout>{children}</AppLayout>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
