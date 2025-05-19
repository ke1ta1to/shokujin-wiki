"use server";

import { PutObjectCommand } from "@aws-sdk/client-s3";
import { z } from "zod";

import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { client } from "@/utils/s3/client";
import { createClient } from "@/utils/supabase/server";

const createOrderSchema = z.object({
  name: z.string().min(1),
  content: z.string().min(1),
  image: z
    .instanceof(File)
    .optional()
    .refine(
      (file) => !file || file.size <= 50 * 1024 * 1024,
      "画像は50MB以下でアップロードしてください",
    ),
});

interface CreateOrderResult
  extends Partial<z.inferFlattenedErrors<typeof createOrderSchema>> {
  success: boolean;
  message?: string;
}

export async function createOrder(
  _prevState: CreateOrderResult,
  formData: FormData,
): Promise<CreateOrderResult> {
  const rawData = Object.fromEntries(formData.entries());

  const parsedData = await createOrderSchema.safeParseAsync(rawData);

  if (!parsedData.success) {
    return {
      success: false,
      ...parsedData.error.flatten(),
    };
  }
  const { name, content, image } = parsedData.data;

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

  // Storageに画像をアップロード
  let imageUrl = "";
  console.log(image);

  if (image && image.size > 0 && image.name !== "undefined") {
    try {
      const key = `user_uploads/${user.id}/${Date.now()}_${image.name}`;
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      await client.send(
        new PutObjectCommand({
          Bucket: "images",
          Key: key,
          Body: buffer,
          ContentType: image.type,
        }),
      );
      imageUrl = key;
    } catch (error) {
      console.error("画像のアップロードに失敗", error);
      return {
        success: false,
        message: "画像のアップロードに失敗しました",
      };
    }
  }

  // データベースに保存
  try {
    await db.insert(orders).values({
      name,
      content,
      userId: user.id,
      imageUrls: [imageUrl].filter(
        (url) => z.string().min(1).safeParse(url).success,
      ),
    });
  } catch {
    return {
      success: false,
      message: "不明なエラーが発生しました",
    };
  }

  return {
    success: true,
  };
}
