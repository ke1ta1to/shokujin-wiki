"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const updateUserSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
});

export type UpdateUserActionResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof updateUserSchema>
    >)
  | { status: "success"; updated: User }
  | { status: "pending" };

export type ResetUserNameActionResult =
  | { status: "error"; message?: string }
  | { status: "success"; updated: User }
  | { status: "pending" };

/**
 * 現在のユーザー情報を取得
 */
export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  return dbUser;
}

/**
 * ユーザーの名前を更新
 */
export async function updateUserName(
  _prevState: UpdateUserActionResult,
  formData: FormData,
): Promise<UpdateUserActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await updateUserSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const { name } = parsedData.data;

  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "ログインしてください",
    };
  }

  // ユーザー情報を更新
  try {
    const updatedUser = await prisma.user.update({
      where: { authId: user.id },
      data: { name },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      updated: updatedUser,
    };
  } catch (error) {
    console.error("Failed to update user name:", error);
    return {
      status: "error",
      message: "名前の更新に失敗しました",
    };
  }
}

/**
 * ユーザーの名前をリセット（nullに設定）
 */
export async function resetUserName(): Promise<ResetUserNameActionResult> {
  // 認証チェック
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      status: "error",
      message: "ログインしてください",
    };
  }

  // ユーザー情報を更新（名前をnullに設定）
  try {
    const updatedUser = await prisma.user.update({
      where: { authId: user.id },
      data: { name: null },
    });

    revalidatePath("/settings");

    return {
      status: "success",
      updated: updatedUser,
    };
  } catch (error) {
    console.error("Failed to reset user name:", error);
    return {
      status: "error",
      message: "名前のリセットに失敗しました",
    };
  }
}
