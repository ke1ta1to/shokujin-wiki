"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import type { Product, User } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const productSchema = z.object({
  name: z.string().min(1, "商品名を入力してください"),
  price: z.coerce.number().min(0, "価格は0以上である必要があります"),
});

export type ProductActionResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof productSchema>
    >)
  | { status: "success"; created?: Product; updated?: Product }
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
function handlePrismaError(error: unknown): ProductActionResult {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return {
        status: "error",
        message: "この商品名はすでに使用されています",
      };
    }
  }

  return {
    status: "error",
    message: "不明なエラーが発生しました",
  };
}

export async function createProduct(
  _prevState: ProductActionResult,
  formData: FormData,
): Promise<ProductActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await productSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const { name, price } = parsedData.data;

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

  // 商品作成処理
  try {
    const createdProduct = await prisma.product.create({
      data: {
        name,
        price,
        userId: dbUser.id,
      },
    });

    // キャッシュの再検証
    revalidatePath("/products");

    return {
      status: "success",
      created: createdProduct,
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}

export async function updateProduct(
  productId: number,
  _prevState: ProductActionResult,
  formData: FormData,
): Promise<ProductActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await productSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const { name, price } = parsedData.data;

  // 認証チェック
  try {
    await authenticateUser();
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

  // 商品の存在確認
  const existingProduct = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true },
  });

  if (!existingProduct) {
    return {
      status: "error",
      message: "商品が見つかりません",
    };
  }

  // 商品更新処理
  try {
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        price,
      },
    });

    // キャッシュの再検証
    revalidatePath("/products");
    revalidatePath(`/products/${productId}`);

    return {
      status: "success",
      updated: updatedProduct,
    };
  } catch (error) {
    return handlePrismaError(error);
  }
}
