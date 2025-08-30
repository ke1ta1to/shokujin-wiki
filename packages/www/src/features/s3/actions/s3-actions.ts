"use server";

import { createPresignedUrl } from "../lib/create-presigned-url";

export async function getPresignedUrlAction(
  filename: string,
  contentType: string,
) {
  try {
    const key = `uploads/${crypto.randomUUID()}/${filename}`;

    const presignedPost = await createPresignedUrl(key, contentType);

    return {
      status: "success" as const,
      presignedPost,
      key,
    };
  } catch (error) {
    console.error("Failed to create presigned URL:", error);
    return {
      status: "error" as const,
      message: "アップロード用URLの作成に失敗しました",
    };
  }
}
