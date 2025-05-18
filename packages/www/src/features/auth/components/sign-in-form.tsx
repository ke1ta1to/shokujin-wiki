"use client";

import { useActionState } from "react";

import { signIn } from "@/features/auth/actions";
import { AuthForm } from "@/features/auth/components/auth-form";

export function SignInForm() {
  const [state, formAction, pending] = useActionState(signIn, {
    success: true,
  });

  return (
    <AuthForm
      mode="signin"
      submitAction={formAction}
      disabled={pending}
      error={[...(state.formErrors || []), state.message].join("\n")}
      errorFields={{
        email: state.fieldErrors?.email?.join("\n"),
        password: state.fieldErrors?.password?.join("\n"),
      }}
    />
  );
}
