import { AppLayout } from "@/components/layouts/app-layout";
import { QueryClientProvider } from "@/components/query-client-provider";
import { UserProvider } from "@/features/auth/components/user-provider";

import "./globals.css";

export default function RootLayout(props: LayoutProps<"/">) {
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
