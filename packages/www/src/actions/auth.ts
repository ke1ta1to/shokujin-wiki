"use server";

import "@/utils/custom-error-map";
import type { AuthError } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import { createClient } from "@/utils/supabase/server";

const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

interface SignInResult
  extends Partial<z.inferFlattenedErrors<typeof signInSchema>> {
  success: boolean;
  message?: string;
}

export async function signIn(
  _prevState: SignInResult,
  formData: FormData,
): Promise<SignInResult> {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await signInSchema.safeParseAsync(rawData);
  if (!parsedData.success) {
    return {
      success: false,
      ...parsedData.error.flatten(),
    };
  }
  const { error } = await supabase.auth.signInWithPassword(parsedData.data);

  if (error) {
    return {
      success: false,
      message: translateError(error),
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

const signUpSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(6),
    confirmPassword: z.string().min(6),
  })
  .refine(async (data) => data.password === data.confirmPassword, {
    message: "パスワードが一致しません",
    path: ["confirmPassword"],
  });

interface SignUpResult
  extends Partial<z.inferFlattenedErrors<typeof signUpSchema>> {
  success: boolean;
  message?: string;
}

export async function signUp(
  _prevState: SignUpResult,
  formData: FormData,
): Promise<SignUpResult> {
  const supabase = await createClient();

  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await signUpSchema.safeParseAsync(rawData);
  if (!parsedData.success) {
    return {
      success: false,
      ...parsedData.error.flatten(),
    };
  }

  const { error } = await supabase.auth.signUp({
    email: parsedData.data.email,
    password: parsedData.data.password,
  });

  if (error) {
    return {
      success: false,
      message: translateError(error),
    };
  }

  revalidatePath("/", "layout");
  redirect("/");
}

// Supabaseのエラーを日本語に翻訳する
function translateError(error: AuthError): string {
  switch (error.code) {
    case "invalid_credentials":
      return "無効な認証情報です。メールアドレスとパスワードを確認してください。";
    case "email_exists":
      return "このメールアドレスは既に登録されています。";
    default:
      return error.message;
  }
}
