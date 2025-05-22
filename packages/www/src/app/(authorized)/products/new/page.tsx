import { AppLayout } from "@/components/app-layout";
import { CreateProductForm } from "@/features/products/components/create-product-form";

export default async function ProductNewPage() {
  return (
    <AppLayout>
      <h1>新規商品登録</h1>
      <CreateProductForm />
    </AppLayout>
  );
}
