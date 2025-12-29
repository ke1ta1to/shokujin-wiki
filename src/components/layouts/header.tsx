"use client";

import Image from "next/image";

import logoImage from "@/assets/logo.svg";
import { SignInDialog } from "@/features/auth/components/sign-in-dialog";
import { UserMenu } from "@/features/auth/components/user-menu";
import { useUser } from "@/features/auth/hooks/use-user";

export function Header() {
  const { user, isLoading } = useUser();
  return (
    <div className="border-t-4 border-t-orange-500">
      <div className="max-w-6xl h-16 mx-auto flex items-center px-4">
        <Image
          alt=""
          src={logoImage}
          className="h-5 w-auto mr-auto"
          loading="eager"
        />
        {user !== null || isLoading ? <UserMenu /> : <SignInDialog />}
      </div>
    </div>
  );
}
