"use client";

import { useActionState } from "react";

import { signUp } from "@/features/auth/actions";
import { AuthForm } from "@/features/components/auth-form";

export function SignUpForm() {
  const [state, formAction, pending] = useActionState(signUp, {
    success: true,
  });

  return (
    <AuthForm
      mode="signup"
      submitAction={formAction}
      disabled={pending}
      error={[...(state.formErrors || []), state.message].join("\n")}
      errorFields={{
        email: state.fieldErrors?.email?.join("\n"),
        password: state.fieldErrors?.password?.join("\n"),
        confirmPassword: state.fieldErrors?.confirmPassword?.join("\n"),
      }}
    />
  );
}
