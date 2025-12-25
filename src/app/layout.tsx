import type { ReactNode } from "react";

import { AppLayout } from "@/components/layouts/app-layout";
import { QueryClientProvider } from "@/components/query-client-provider";
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
        <QueryClientProvider>
          <UserProvider>
            <AppLayout>{children}</AppLayout>
          </UserProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
