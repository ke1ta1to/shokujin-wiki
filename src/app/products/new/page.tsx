import { Box, Typography } from "@mui/material";

import { CreateProductForm } from "@/features/product/components/create-product-form";

export default async function NewProductPage() {
  return (
    <Box mt={8}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        メニュー登録
      </Typography>
      <Box maxWidth={400} mx="auto">
        <CreateProductForm />
      </Box>
    </Box>
  );
}
