"use server";

import prisma from "@/lib/prisma";

export async function searchProducts(searchTerm: string) {
  const products = await prisma.product.findMany({
    where: searchTerm
      ? {
          name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        }
      : undefined,
    select: {
      id: true,
      name: true,
      price: true,
    },
    orderBy: {
      name: "asc",
    },
    take: 50,
  });

  return products;
}
