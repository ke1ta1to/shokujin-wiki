import { Divider, Stack } from "@mui/material";
import { desc } from "drizzle-orm";
import NextLink from "next/link";

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
      <Stack
        divider={<Divider />}
        sx={{
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {orderList.map((order) => (
          <NextLink
            href={`/orders/${order.id}`}
            key={order.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <OrderPreview order={order} />
          </NextLink>
        ))}
      </Stack>
    </AppLayout>
  );
}
