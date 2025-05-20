import { Divider, Stack } from "@mui/material";
import { desc } from "drizzle-orm";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";
import { db } from "@/db/drizzle";
import { eats } from "@/db/schema";
import { EatPreview } from "@/features/eats/components/eat-preview";

export default async function IndexPage() {
  const eatList = await db.select().from(eats).orderBy(desc(eats.createdAt));
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
