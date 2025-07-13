"use client";

import { useRouter } from "next/navigation";

import { createClient } from "@/utils/supabase/client";

export function LoginForm() {
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const supabase = createClient();

    const { email, password } = Object.fromEntries(
      new FormData(e.currentTarget),
    );
    if (typeof email !== "string" || typeof password !== "string") {
      throw new Error("Invalid form data");
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      router.push("/");
    } catch (error) {
      const errorStr =
        error instanceof Error ? error.message : "An error occurred";
      console.log(errorStr);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <button type="submit">Login</button>
    </form>
  );
}
