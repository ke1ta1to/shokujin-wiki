"use server";

import { z } from "zod";

import { db } from "@/db/drizzle";
import { products } from "@/db/schema";
import { createClient } from "@/utils/supabase/server";

const createProductSchema = z.object({
  name: z.string().min(1, "商品名を入力してください"),
  price: z.coerce.number().min(0, "価格は0以上である必要があります").optional(),
});

interface CreateProductResult
  extends Partial<z.inferFlattenedErrors<typeof createProductSchema>> {
  success: boolean;
  message?: string;
}

export async function createProduct(
  _prevState: CreateProductResult,
  formData: FormData,
): Promise<CreateProductResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await createProductSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      success: false,
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
      success: false,
      message: "ログインしてください",
    };
  }

  // データベースに保存
  try {
    await db.insert(products).values({
      name,
      price,
      userId: user.id,
      updatedBy: user.id,
    });
  } catch (error) {
    // ユニーク制約違反のエラーかどうかを判断
    if (error instanceof Error && error.message.includes("duplicate key")) {
      return {
        success: false,
        message: "この商品名はすでに登録されています",
      };
    }

    return {
      success: false,
      message: "不明なエラーが発生しました",
    };
  }

  return {
    success: true,
  };
}
