import { Box } from "@mui/material";
import { notFound } from "next/navigation";

import { AppLayout } from "@/components/app-layout";
import { EatDetail } from "@/features/eats/components/eat-detail";
import { getEatWithProductById } from "@/features/eats/db";

interface EatDetailPageProps {
  params: Promise<{
    eatId: string;
  }>;
}

export default async function EatDetailPage({ params }: EatDetailPageProps) {
  const { eatId } = await params;
  const eat = await getEatWithProductById(parseInt(eatId));

  if (!eat) {
    notFound();
  }

  return (
    <AppLayout>
      <Box maxWidth={600} margin="0 auto" pt={2}>
        <EatDetail eat={eat} />
      </Box>
    </AppLayout>
  );
}
