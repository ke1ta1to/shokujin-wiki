import { Container, Typography } from "@mui/material";
import { notFound, redirect } from "next/navigation";

import { EditProductForm } from "@/features/product/components/edit-product-form";
import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;

  const productIdNumber = parseInt(productId, 10);
  if (isNaN(productIdNumber)) {
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

  // 商品を取得
  const product = await prisma.product.findUnique({
    where: { id: productIdNumber },
  });

  if (!product) {
    notFound();
  }

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" gutterBottom>
        商品を編集
      </Typography>
      <EditProductForm product={product} />
    </Container>
  );
}
