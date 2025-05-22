import { Grid } from "@mui/material";
import NextLink from "next/link";

import { AppLayout } from "@/components/app-layout";
import { ProductPreview } from "@/features/products/components/product-preview";
import { getProducts } from "@/features/products/db";

export default async function ProductsPage() {
  const productList = await getProducts();

  return (
    <AppLayout>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {productList.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 4, lg: 3, xl: 2 }}>
            <NextLink
              href={`/products/${product.id}`}
              key={product.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <ProductPreview product={product} />
            </NextLink>
          </Grid>
        ))}
      </Grid>
    </AppLayout>
  );
}
