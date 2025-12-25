"use client";

import type { User } from "@supabase/supabase-js";
import { createContext, useEffect, useState } from "react";

import { supabaseClient } from "@/lib/supabase/client";

export const context = createContext<User | null | "loading" | undefined>(
  undefined,
);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider(props: UserProviderProps) {
  const { children } = props;

  const [user, setUser] = useState<User | null | "loading">("loading");

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });
    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return <context.Provider value={user}>{children}</context.Provider>;
}
