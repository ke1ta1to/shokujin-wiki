import { Divider, Stack } from "@mui/material";
import { desc } from "drizzle-orm";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";
import { db } from "@/db/drizzle";
import { EatPreview } from "@/features/eats/components/eat-preview";

export default async function IndexPage() {
  const eatList = await db.query.eats.findMany({
    orderBy: (e) => [desc(e.createdAt)],
  });
  return (
    <AppLayout>
      <Stack
        divider={<Divider />}
        sx={{
          maxWidth: 600,
          margin: "0 auto",
        }}
      >
        {eatList.map((eat) => (
          <NextLink
            href={`/eats/${eat.id}`}
            key={eat.id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <EatPreview eat={eat} />
          </NextLink>
        ))}
      </Stack>
    </AppLayout>
  );
}
