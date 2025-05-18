import { AppLayout } from "@/components/app-layout";
import { CreateOrderForm } from "@/features/orders/components/create-order-form";

export default async function OrderNewPage() {
  return (
    <AppLayout>
      <h1>新規注文登録</h1>
      <CreateOrderForm />
    </AppLayout>
  );
}
