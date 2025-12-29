import { useCallback, useContext } from "react";
import { toast } from "sonner";

import { context } from "../components/user-provider";

import { supabaseClient } from "@/lib/supabase/client";

export function useUser() {
  const user = useContext(context);
  if (typeof user === "undefined") {
    throw new Error("useUser must be used within a UserProvider");
  }

  const signOut = useCallback(async () => {
    await supabaseClient.auth.signOut();
    toast.success("ログアウトしました");
  }, []);

  return {
    user: user === "loading" ? null : user,
    isLoading: user === "loading",
    signOut,
  };
}
