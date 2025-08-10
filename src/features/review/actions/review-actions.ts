"use server";

import { z } from "zod";

import type { Review } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const createReviewSchema = z.object({
  comment: z.string().min(1, "コメントを入力してください"),
  productId: z.coerce.number().min(1, "商品を選択してください"),
  imageUrl: z.string().optional(),
});

const updateReviewSchema = z.object({
  comment: z.string().min(1, "コメントを入力してください"),
  productId: z.coerce.number().min(1, "商品を選択してください"),
  imageUrl: z.string().optional(),
});

export type ReviewActionResult =
  | ({ status: "error"; message?: string } & {
      fieldErrors?: {
        comment?: string[];
        productId?: string[];
        imageUrl?: string[];
      };
      formErrors?: string[];
    })
  | { status: "success"; created?: Review; updated?: Review }
  | { status: "pending" };

export async function createReview(
  _prevState: ReviewActionResult,
  formData: FormData,
): Promise<ReviewActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  console.log(rawData);

  const parsedData = await createReviewSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    const { fieldErrors, formErrors } = parsedData.error.flatten();
    return {
      status: "error",
      fieldErrors,
      formErrors,
    };
  }

  const { comment, productId, imageUrl } = parsedData.data;

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

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!dbUser) {
    return {
      status: "error",
      message: "ユーザーが見つかりません",
    };
  }

  // データベースに保存
  try {
    const createdReview = await prisma.review.create({
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

    return {
      status: "success",
      created: createdReview,
    };
  } catch {
    return {
      status: "error",
      message: "レビューの作成に失敗しました",
    };
  }
}

export async function updateReview(
  reviewId: number,
  _prevState: ReviewActionResult,
  formData: FormData,
): Promise<ReviewActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await updateReviewSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    const { fieldErrors, formErrors } = parsedData.error.flatten();
    return {
      status: "error",
      fieldErrors,
      formErrors,
    };
  }

  const { comment, productId, imageUrl } = parsedData.data;

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

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!dbUser) {
    return {
      status: "error",
      message: "ユーザーが見つかりません",
    };
  }

  // レビューの存在確認と所有者チェック
  const existingReview = await prisma.review.findUnique({
    where: { id: reviewId },
    select: { userId: true },
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

  // データベースを更新
  try {
    const updatedReview = await prisma.review.update({
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

    return {
      status: "success",
      updated: updatedReview,
    };
  } catch {
    return {
      status: "error",
      message: "レビューの更新に失敗しました",
    };
  }
}
