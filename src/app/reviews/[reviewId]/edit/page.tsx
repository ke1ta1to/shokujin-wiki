import { Container, Typography } from "@mui/material";
import { notFound, redirect } from "next/navigation";

import { EditReviewForm } from "@/features/review/components/edit-review-form";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface EditReviewPageProps {
  params: Promise<{
    reviewId: string;
  }>;
}

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { reviewId } = await params;
  const reviewIdNumber = parseInt(reviewId, 10);

  if (isNaN(reviewIdNumber)) {
    notFound();
  }

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

  // レビューを取得
  const review = await prisma.review.findUnique({
    where: { id: reviewIdNumber },
    include: {
      product: true,
    },
  });

  if (!review) {
    notFound();
  }

  // 所有者でない場合はリダイレクト
  if (review.userId !== dbUser.id) {
    redirect(`/reviews/${reviewId}`);
  }

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        レビューを編集
      </Typography>
      <EditReviewForm review={review} />
    </Container>
  );
}
