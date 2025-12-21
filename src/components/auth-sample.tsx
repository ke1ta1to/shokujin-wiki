"use client";

import type { User } from "@supabase/supabase-js";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

export function AuthSample() {
  const [user, setUser] = useState<User | null>(null);

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { email, password } = Object.fromEntries(
      new FormData(e.currentTarget),
    ) as { email: string; password: string };
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    );
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Signed in successfully!");
    }
  };

  const handleSignOut = async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    );
    const { error } = await supabase.auth.signOut();
    if (error) {
      alert(`Error: ${error.message}`);
    } else {
      alert("Signed out successfully!");
    }
  };

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
    );
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => void subscription.unsubscribe();
  }, []);

  return (
    <div>
      <h2>Sign In</h2>
      {user && <p>Signed in as: {user.email}</p>}
      <form id="sign-in-form" onSubmit={handleSignIn}>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Email"
          required
        />
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Password"
          required
        />
      </form>
      <button form="sign-in-form" type="submit">
        Sign In
      </button>
      <h2>Sign Out</h2>
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}
