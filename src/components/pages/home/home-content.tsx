"use client";

import { useUser } from "@/features/auth/hooks/use-user";

export function HomeContent() {
  const { user } = useUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}
