"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

/**
 * 認証状態変更時にユーザーをDBに同期
 */
export async function syncUserAction(): Promise<{ success: boolean }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.id) {
    try {
      await prisma.user.upsert({
        where: { authId: user.id },
        update: {},
        create: { authId: user.id },
      });
      return { success: true };
    } catch (error) {
      console.error("User sync failed:", error);
      return { success: false };
    }
  }

  return { success: false };
}
