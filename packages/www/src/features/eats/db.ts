import { desc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { eats } from "@/db/schema";

export const getEatWithProductById = async (id: number) =>
  db.query.eats.findFirst({
    where: eq(eats.id, id),
    with: {
      product: true,
    },
  });

export const getEatsWithProduct = async () =>
  db.query.eats.findMany({
    with: {
      product: true,
    },
    orderBy: (e) => desc(e.createdAt),
  });
