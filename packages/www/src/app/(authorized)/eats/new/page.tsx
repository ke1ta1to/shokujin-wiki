import { AppLayout } from "@/components/app-layout";
import { CreateEatForm } from "@/features/eats/components/create-eat-form";
import { getProducts } from "@/features/products/db";

export default async function EatNewPage() {
  const products = await getProducts();

  return (
    <AppLayout>
      <h1>新規注文登録</h1>
      <CreateEatForm products={products} />
    </AppLayout>
  );
}
