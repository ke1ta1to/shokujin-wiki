import { asc, eq } from "drizzle-orm";

import { db } from "@/db/drizzle";
import { products } from "@/db/schema";

export const getProductById = async (id: number) =>
  db.query.products.findFirst({
    where: eq(products.id, id),
  });

export const getProducts = async () =>
  db.query.products.findMany({
    orderBy: (p) => asc(p.name),
  });
