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

export type ReviewActionResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof createReviewSchema>
    >)
  | { status: "success"; created: Review }
  | { status: "pending" };

export async function createReview(
  _prevState: ReviewActionResult,
  formData: FormData,
): Promise<ReviewActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  console.log(rawData);

  const parsedData = await createReviewSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
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
