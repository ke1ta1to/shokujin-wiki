import type { ReactNode } from "react";

import { AppLayout } from "@/components/layouts/app-layout";
import { UserProvider } from "@/features/auth/components/user-provider";
import "./globals.css";

export interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout(props: RootLayoutProps) {
  const { children } = props;

  return (
    <html lang="ja">
      <body>
        <UserProvider>
          <AppLayout>{children}</AppLayout>
        </UserProvider>
      </body>
    </html>
  );
}
