import AuthProtected from "@/features/auth/components/auth-protected";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <AuthProtected>{children}</AuthProtected>;
}
