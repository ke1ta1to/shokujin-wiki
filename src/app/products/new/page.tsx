import { Box } from "@mui/material";

import { NewProductForm } from "@/features/product/components/new-product-form";

export default async function NewProductPage() {
  return (
    <div>
      <h1>New Review Page</h1>
      <Box maxWidth={400} mx="auto">
        <NewProductForm />
      </Box>
    </div>
  );
}
