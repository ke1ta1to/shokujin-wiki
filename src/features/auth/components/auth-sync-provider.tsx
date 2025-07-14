"use client";

import { useEffect } from "react";

import { syncUserAction } from "../actions/auth";

import { createClient } from "@/lib/supabase/client";

/**
 * 認証状態変更時のユーザー同期を管理するProvider
 */
export function AuthSyncProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const supabase = createClient();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        try {
          await syncUserAction();
        } catch (error) {
          console.error("User sync error:", error);
        }
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return <>{children}</>;
}
