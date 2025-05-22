import { Divider, Stack } from "@mui/material";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";
import { EatPreview } from "@/features/eats/components/eat-preview";
import { getEatsWithProduct } from "@/features/eats/db";

export default async function IndexPage() {
  const eatList = await getEatsWithProduct();

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
