"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

import type { Article, User } from "@/generated/prisma";
import { PrismaClientKnownRequestError } from "@/generated/prisma/runtime/library";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

const articleSchema = z.object({
  title: z.string().min(1, "タイトルを入力してください"),
  slug: z
    .string()
    .min(1, "URLパスを入力してください")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "URLパスは英小文字、数字、ハイフンのみ使用できます",
    ),
  content: z.string().min(1, "本文を入力してください"),
  isPublished: z.enum(["true", "false"]).transform((val) => val === "true"),
  mainProductId: z.coerce.number().optional(),
  relatedProductIds: z.preprocess((val) => {
    if (typeof val === "string" && val) {
      return val.split(",").map((id) => parseInt(id, 10));
    }
    return [];
  }, z.array(z.number())),
});

export type ArticleActionResult =
  | ({ status: "error"; message?: string } & Partial<
      z.inferFlattenedErrors<typeof articleSchema>
    >)
  | { status: "success"; created: Article }
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

// メイン商品と関連商品の重複チェック
function validateProductRelations(
  mainProductId: number | undefined,
  relatedProductIds: number[],
): ArticleActionResult | null {
  if (mainProductId && relatedProductIds.includes(mainProductId)) {
    return {
      status: "error",
      message: "メイン商品は関連商品に含めることができません",
    };
  }
  return null;
}

// Prismaエラーハンドリングの共通化
function handlePrismaError(error: unknown): ArticleActionResult {
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      const target = error.meta?.target;
      if (target && Array.isArray(target) && target.includes("slug")) {
        return {
          status: "error",
          fieldErrors: {
            slug: ["このURLパスはすでに使用されています"],
          },
        };
      }
      return {
        status: "error",
        message: "この記事はすでに登録されています",
      };
    }
  }

  return {
    status: "error",
    message: "不明なエラーが発生しました",
  };
}

export async function createArticle(
  _prevState: ArticleActionResult,
  formData: FormData,
): Promise<ArticleActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await articleSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const {
    title,
    slug,
    content,
    isPublished,
    mainProductId,
    relatedProductIds,
  } = parsedData.data;

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

  // 商品関連のバリデーション
  const productValidationError = validateProductRelations(
    mainProductId,
    relatedProductIds,
  );
  if (productValidationError) {
    return productValidationError;
  }

  // 記事作成処理
  try {
    await prisma.$transaction(async (tx) => {
      // 1. 記事を作成
      const article = await tx.article.create({
        data: {
          title,
          slug,
          content,
          isPublished,
          userId: dbUser.id,
        },
      });

      // 2. メイン商品を設定
      if (mainProductId) {
        await tx.product.update({
          where: { id: mainProductId },
          data: { mainArticleId: article.id },
        });
      }

      // 3. 関連商品を設定
      if (relatedProductIds.length > 0) {
        await tx.articleProduct.createMany({
          data: relatedProductIds.map((productId) => ({
            articleId: article.id,
            productId,
          })),
        });
      }

      return article;
    });
  } catch (error) {
    return handlePrismaError(error);
  }

  // キャッシュの再検証
  revalidatePath("/articles");
  revalidatePath(`/articles/${slug}`);
  if (mainProductId) {
    revalidatePath(`/products/${mainProductId}`);
  }

  // 作成した記事ページへリダイレクト
  redirect(`/articles/${slug}`);
}

export async function updateArticle(
  currentSlug: string,
  _prevState: ArticleActionResult,
  formData: FormData,
): Promise<ArticleActionResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await articleSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      status: "error",
      ...parsedData.error.flatten(),
    };
  }

  const {
    title,
    slug,
    content,
    isPublished,
    mainProductId,
    relatedProductIds,
  } = parsedData.data;

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

  // 記事の存在確認
  const existingArticle = await prisma.article.findUnique({
    where: { slug: currentSlug },
    select: { id: true },
  });

  if (!existingArticle) {
    return {
      status: "error",
      message: "記事が見つかりません",
    };
  }

  // 商品関連のバリデーション
  const productValidationError = validateProductRelations(
    mainProductId,
    relatedProductIds,
  );
  if (productValidationError) {
    return productValidationError;
  }

  // 記事更新処理
  try {
    await prisma.$transaction(async (tx) => {
      // 1. 既存のメイン商品の関連を解除
      await tx.product.updateMany({
        where: { mainArticleId: existingArticle.id },
        data: { mainArticleId: null },
      });

      // 2. 既存の関連商品を削除
      await tx.articleProduct.deleteMany({
        where: { articleId: existingArticle.id },
      });

      // 3. 記事を更新
      const article = await tx.article.update({
        where: { id: existingArticle.id },
        data: {
          title,
          slug,
          content,
          isPublished,
        },
      });

      // 4. 新しいメイン商品を設定
      if (mainProductId) {
        await tx.product.update({
          where: { id: mainProductId },
          data: { mainArticleId: article.id },
        });
      }

      // 5. 新しい関連商品を設定
      if (relatedProductIds.length > 0) {
        await tx.articleProduct.createMany({
          data: relatedProductIds.map((productId) => ({
            articleId: article.id,
            productId,
          })),
        });
      }

      return article;
    });
  } catch (error) {
    return handlePrismaError(error);
  }

  // キャッシュの再検証
  revalidatePath("/articles");
  revalidatePath(`/articles/${currentSlug}`);
  revalidatePath(`/articles/${slug}`);
  if (mainProductId) {
    revalidatePath(`/products/${mainProductId}`);
  }

  // 更新した記事ページへリダイレクト
  redirect(`/articles/${slug}`);
}

// slug生成用のヘルパー関数
export async function generateSlug(title: string): Promise<string> {
  // 日本語をローマ字に変換する簡易実装
  // 実際のプロジェクトでは、より高度な変換ライブラリを使用することを推奨
  const base = title
    .toLowerCase()
    .replace(/[ぁ-ん]/g, "") // ひらがな削除
    .replace(/[ァ-ヴ]/g, "") // カタカナ削除
    .replace(/[一-龠]/g, "") // 漢字削除
    .replace(/[^a-z0-9]+/g, "-") // 英数字以外をハイフンに
    .replace(/^-+|-+$/g, "") // 前後のハイフン削除
    .replace(/-+/g, "-"); // 連続ハイフンを1つに

  // ベースがない場合はランダム文字列
  const baseSlug = base || `article-${Date.now()}`;

  // 重複チェック
  let slug = baseSlug;
  let counter = 1;
  while (true) {
    const existing = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) break;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
