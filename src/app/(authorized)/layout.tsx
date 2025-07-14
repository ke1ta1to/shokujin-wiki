import LoginContinueBlock from "@/features/auth/components/login-continue-block";
import { createClient } from "@/lib/supabase/server";

export default async function AuthorizedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <LoginContinueBlock />;
  }

  return children;
}
