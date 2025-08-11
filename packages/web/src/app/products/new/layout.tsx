import AuthProtected from "@/features/auth/components/auth-protected";

export default async function NewProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProtected>{children}</AuthProtected>;
}
