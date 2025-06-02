"use server";

import type { InferInsertModel } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

const createProductSchema = z.object({
  name: z.string().min(1, "商品名を入力してください"),
  price: z.coerce.number().min(0, "価格は0以上である必要があります").optional(),
});

type CreateProductResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof createProductSchema>
    >)
  | { status: "success"; created: InferInsertModel<typeof products> }
  | { status: "pending" };

export async function createProduct(
  _prevState: CreateProductResult,
  formData: FormData,
): Promise<CreateProductResult> {
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

  // データベースに保存

  // 作成したプロダクト
  let createdProduct: InferInsertModel<typeof products>;
  try {
    createdProduct = await db
      .insert(products)
      .values({
        name,
        price,
        userId: user.id,
        updatedBy: user.id,
      })
      .returning()
      .then((res) => res[0]);
  } catch (error) {
    // ユニーク制約違反のエラーかどうかを判断
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        status: "error",
        message: "この商品名はすでに登録されています",
      };
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
