import { Divider, Stack } from "@mui/material";
import { desc } from "drizzle-orm";

import { AppLayout } from "@/components/app-layout";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { OrderPreview } from "@/features/orders/components/order-preview";

export default async function IndexPage() {
  const orderList = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));
  return (
    <AppLayout>
      <h1>Index Page</h1>
      <Stack
        divider={<Divider />}
        sx={{
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {orderList.map((order) => (
          <OrderPreview order={order} key={order.id} />
        ))}
      </Stack>
    </AppLayout>
  );
}
