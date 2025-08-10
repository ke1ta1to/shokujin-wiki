"use server";

import { z } from "zod";

import type { Product } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const createProductSchema = z.object({
  name: z.string().min(1, "商品名を入力してください"),
  price: z.coerce.number().min(0, "価格は0以上である必要があります"),
});

export type ProductActionResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof createProductSchema>
    >)
  | { status: "success"; created: Product }
  | { status: "pending" };

export async function createProduct(
  _prevState: ProductActionResult,
  formData: FormData,
): Promise<ProductActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await createProductSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const { name, price } = parsedData.data;

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

  // 作成したプロダクト
  let createdProduct: Product;
  try {
    createdProduct = await prisma.product.create({
      data: {
        name,
        price: price,
        userId: dbUser.id,
      },
    });
  } catch (error) {
    // ユニーク制約違反のエラーかどうかを判断
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return {
          status: "error",
          message: "この商品はすでに登録されています",
        };
      }
    }

    return {
      status: "error",
      message: "不明なエラーが発生しました",
    };
  }

  return {
    status: "success",
    created: createdProduct,
  };
}
