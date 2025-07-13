import { Button } from "@mui/material";
import Link from "next/link";

import { LoginForm } from "@/features/auth/components/login-form";
import { LogoutButton } from "@/features/auth/components/logout-button";
import { createClient } from "@/utils/supabase/server";

export default async function IndexPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1>Index Page</h1>
      <LoginForm />
      <Button component={Link} href="/auth/login">
        ログイン
      </Button>
      <Button component={Link} href="/auth/sign-up">
        サインアップ
      </Button>
      <LogoutButton>ログアウト</LogoutButton>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
