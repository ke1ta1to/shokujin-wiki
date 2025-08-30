import { Container, Typography } from "@mui/material";
import { notFound, redirect } from "next/navigation";

import { EditArticleForm } from "@/features/article/components/edit-article-form";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface EditArticlePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { slug } = await params;

  // 認証ユーザーを取得
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { authId: user.id },
  });

  if (!dbUser) {
    redirect("/auth/login");
  }

  // 記事を取得（公開状態に関わらず）
  const article = await prisma.article.findUnique({
    where: { slug },
    include: {
      mainProduct: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });

  if (!article) {
    notFound();
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        記事を編集
      </Typography>
      <EditArticleForm article={article} />
    </Container>
  );
}
