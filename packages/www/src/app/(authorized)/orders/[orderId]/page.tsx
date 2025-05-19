import { Box } from "@mui/material";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { AppLayout } from "@/components/app-layout";
import { db } from "@/db/drizzle";
import { orders } from "@/db/schema";
import { OrderDetail } from "@/features/orders/components/order-detail";

interface OrderDetailPageProps {
  params: Promise<{
    orderId: string;
  }>;
}

export default async function OrderDetailPage({
  params,
}: OrderDetailPageProps) {
  const { orderId } = await params;
  const order = await db.query.orders.findFirst({
    where: eq(orders.id, parseInt(orderId)),
  });

  if (!order) {
    notFound();
  }

  return (
    <AppLayout>
      <Box maxWidth={600} margin="0 auto" pt={2}>
        <OrderDetail order={order} />
      </Box>
    </AppLayout>
  );
}
