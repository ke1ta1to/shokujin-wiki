import { AppLayout } from "@/components/app-layout";
import { CreateEatForm } from "@/features/eats/components/create-eat-form";

export default async function EatNewPage() {
  return (
    <AppLayout>
      <h1>新規注文登録</h1>
      <CreateEatForm />
    </AppLayout>
  );
}
