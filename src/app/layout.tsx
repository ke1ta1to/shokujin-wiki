import type { ReactNode } from "react";

import { AppLayout } from "@/components/layouts/app-layout";

import "./globals.css";

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <AppLayout>{children}</AppLayout>
      </body>
    </html>
  );
}
