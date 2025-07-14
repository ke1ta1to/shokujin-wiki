"use client";

import type { ButtonProps } from "@mui/material";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = Omit<ButtonProps, "onClick">;

export function LogoutButton(props: LogoutButtonProps) {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return <Button {...props} onClick={logout} />;
}
