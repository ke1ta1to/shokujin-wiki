import AuthProtected from "@/features/auth/components/auth-protected";

export default async function NewArticleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProtected>{children}</AuthProtected>;
}
