import { Box } from "@mui/material";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { AppLayout } from "@/components/app-layout";
import { db } from "@/db/drizzle";
import { eats } from "@/db/schema";
import { EatDetail } from "@/features/eats/components/eat-detail";

interface EatDetailPageProps {
  params: Promise<{
    eatId: string;
  }>;
}

export default async function EatDetailPage({ params }: EatDetailPageProps) {
  const { eatId } = await params;
  const eat = await db.query.eats.findFirst({
    where: eq(eats.id, parseInt(eatId)),
  });

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
