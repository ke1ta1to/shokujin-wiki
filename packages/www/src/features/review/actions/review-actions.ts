"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Review, User } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const reviewSchema = z.object({
  comment: z.string().min(1, "コメントを入力してください"),
  productId: z.coerce.number().min(1, "商品を選択してください"),
  imageUrl: z.string().optional(),
});

export type ReviewActionResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof reviewSchema>
    >)
  | { status: "success"; created?: Review; updated?: Review }
  | { status: "pending" };

// 認証とユーザー取得の共通処理
/**
 * ユーザーの認証を行い、DBからユーザー情報を取得します。
 * @throws エラーが発生した場合
 * @returns 認証されたユーザー情報
 */
async function authenticateUser(): Promise<{ dbUser: User }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("ログインしてください");
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!dbUser) {
    throw new Error("ユーザーが見つかりません");
  }

  return { dbUser };
}

// Prismaエラーハンドリングの共通化
function handlePrismaError(error: unknown): ReviewActionResult {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        status: "error",
        message: "このレビューはすでに登録されています",
      };
    }
    if (error.code === "P2003") {
      return {
        status: "error",
        message: "指定された商品が存在しません",
      };
    }
  }

  return {
    status: "error",
    message: "不明なエラーが発生しました",
  };
}

export async function createReview(
  _prevState: ReviewActionResult,
  formData: FormData,
): Promise<ReviewActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await reviewSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const { comment, productId, imageUrl } = parsedData.data;

  // 認証チェック
  let authResult: { dbUser: User };
  try {
    authResult = await authenticateUser();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: "error",
        message: error.message,
      };
    }
    return {
      status: "error",
      message: "不明なエラーが発生しました",
    };
  }

  const dbUser = authResult.dbUser;

  // レビュー作成処理
  let createdReview: Review;
  try {
    createdReview = await prisma.review.create({
      data: {
        comment,
        imageUrls: imageUrl ? [imageUrl] : [],
        userId: dbUser.id,
        productId,
      },
      include: {
        user: true,
        product: true,
      },
    });
  } catch (error) {
    return handlePrismaError(error);
  }

  // キャッシュの再検証
  revalidatePath("/");
  revalidatePath(`/products/${productId}`);
  revalidatePath(`/reviews/${createdReview.id}`);

  return {
    status: "success",
    created: createdReview,
  };
}

export async function updateReview(
  reviewId: number,
  _prevState: ReviewActionResult,
  formData: FormData,
): Promise<ReviewActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await reviewSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const { comment, productId, imageUrl } = parsedData.data;

  // 認証チェック
  let authResult: { dbUser: User };
  try {
    authResult = await authenticateUser();
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        status: "error",
        message: error.message,
      };
    }
    return {
      status: "error",
      message: "不明なエラーが発生しました",
    };
  }

  const dbUser = authResult.dbUser;

  // レビューの存在確認と所有者チェック
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true, productId: true },
  });

  if (!existingReview) {
    return {
      status: "error",
      message: "レビューが見つかりません",
    };
  }

  if (existingReview.userId !== dbUser.id) {
    return {
      status: "error",
      message: "このレビューを編集する権限がありません",
    };
  }

  // レビュー更新処理
  let updatedReview: Review;
  try {
    updatedReview = await prisma.review.update({
      where: { id: reviewId },
      data: {
        comment,
        productId,
        imageUrls: imageUrl ? [imageUrl] : [],
      },
      include: {
        user: true,
        product: true,
      },
    });
  } catch (error) {
    return handlePrismaError(error);
  }

  // キャッシュの再検証
  revalidatePath("/");
  revalidatePath(`/reviews/${reviewId}`);
  // 元の商品ページも再検証
  if (existingReview.productId !== productId) {
    revalidatePath(`/products/${existingReview.productId}`);
  }
  revalidatePath(`/products/${productId}`);

  return {
    status: "success",
    updated: updatedReview,
  };
}
