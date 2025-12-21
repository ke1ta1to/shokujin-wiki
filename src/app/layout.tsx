import type { ReactNode } from "react";
import "./globals.css";

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
