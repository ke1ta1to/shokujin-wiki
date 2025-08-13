import type { PresignedPost } from "@aws-sdk/s3-presigned-post";

/**
 * アセットをS3にアップロードする
 * @param presignedPost 署名付きURLとフォームフィールド
 * @param file アップロードするファイル
 * @returns アップロードしたファイルのURL
 * @throws アップロードに失敗した場合
 */
export async function uploadAssets(
  presignedPost: PresignedPost,
  file: File,
): Promise<string> {
  const formData = new FormData();

  // presignedPostのfieldsを全てFormDataに追加
  Object.entries(presignedPost.fields).forEach(([key, value]) => {
    formData.append(key, value);
  });

  // ファイルは最後に追加（AWS S3の仕様）
  formData.append("file", file);

  const response = await fetch(presignedPost.url, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`アップロードに失敗しました: ${response.statusText}`);
  }

  // アップロードしたファイルのURLを返す
  // S3のURLはpresignedPost.urlとkeyを組み合わせて構築
  const key = presignedPost.fields.key || presignedPost.fields.Key;
  if (!key) {
    throw new Error("アップロードキーが見つかりません");
  }

  return `${presignedPost.url}/${key}`;
}
