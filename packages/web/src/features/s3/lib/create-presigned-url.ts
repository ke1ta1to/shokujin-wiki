import "server-only";
import type { PresignedPost } from "@aws-sdk/s3-presigned-post";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";

import { createClient } from "./client";

/**
 * S3へのオブジェクトアップロード用の署名付きURLを作成
 * @param key S3内のオブジェクトのキー
 * @param contentType オブジェクトのコンテンツタイプ
 * @returns 署名付きURLとフォームフィールドを含むオブジェクト
 */
export async function createPresignedUrl(
  key: string,
  contentType: string,
): Promise<PresignedPost> {
  const client = createClient();
  const { url, fields } = await createPresignedPost(client, {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: key,
    Conditions: [
      ["content-length-range", 0, 20 * 1024 * 1024], // 最大20MB
      ["starts-with", "$Content-Type", "image/"],
    ],
    Fields: {
      "Content-Type": contentType,
    },
    Expires: 3600,
  });
  return {
    url,
    fields,
  };
}
