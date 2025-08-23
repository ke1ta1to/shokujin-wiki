import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function verifyCloudFrontOrigin(
  request: NextRequest,
): NextResponse | null {
  // 開発環境ではスキップ
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const token = request.headers.get("x-origin-verify");

  if (token !== process.env.ORIGIN_VERIFY_TOKEN) {
    return new NextResponse("null", { status: 403 });
  }

  return null; // 検証成功
}
