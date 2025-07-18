"use client";

import { useUser } from "../hooks/use-user";

import LoginContinueBlock from "./login-continue-block";

export default function AuthProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();

  if (!user) {
    return <LoginContinueBlock />;
  }

  return <>{children}</>;
}
