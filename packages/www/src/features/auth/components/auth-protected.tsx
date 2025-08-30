"use client";

import { Suspense } from "react";

import { useUser } from "../hooks/use-user";

import LoginContinueBlock from "./login-continue-block";

export default function AuthProtected({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useUser();

  if (!user && !isLoading) {
    return (
      <Suspense>
        <LoginContinueBlock />
      </Suspense>
    );
  }

  return <>{children}</>;
}
