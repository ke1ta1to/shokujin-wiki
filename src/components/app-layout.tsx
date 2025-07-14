import { AuthProvider } from "@/features/auth/components/auth-provider";

export function AppLayout({ children }: { children: React.ReactNode }) {
  return <AuthProvider>{children}</AuthProvider>;
}
