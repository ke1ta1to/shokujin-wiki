"use client";

import { Button } from "@mui/material";
import type { ComponentProps } from "react";

import { signOut } from "@/actions/auth";

type SignOutButtonProps = Omit<ComponentProps<typeof Button>, "onClick">;

export function SignOutButton(props: SignOutButtonProps) {
  const handleClick = async () => {
    await signOut();
  };
  return <Button {...props} onClick={handleClick} />;
}
