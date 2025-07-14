import { AuthSyncProvider } from "@/features/auth/components/auth-sync-provider";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthSyncProvider>{children}</AuthSyncProvider>;
}
