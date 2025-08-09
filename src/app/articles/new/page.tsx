import { Box, Typography } from "@mui/material";

import { CreateArticleForm } from "@/features/article/components/create-article-form";

export default async function NewArticlePage() {
  return (
    <Box mt={8}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        記事作成
      </Typography>
      <Box maxWidth={800} mx="auto">
        <CreateArticleForm />
      </Box>
    </Box>
  );
}
