import {
  Schedule as ScheduleIcon,
  Label as LabelIcon,
} from "@mui/icons-material";
import {
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Stack,
  Chip,
  Box,
  CardMedia,
} from "@mui/material";

import type { Article, User } from "@/generated/prisma";

interface ArticlePreviewCardProps {
  article: Article & {
    user: Pick<User, "id">;
    _count?: {
      products: number;
    };
    mainProductImageUrl?: string | null;
  };
}

export function ArticlePreviewCard({ article }: ArticlePreviewCardProps) {
  return (
    <Card>
      <CardActionArea>
        <Box sx={{ display: "flex" }}>
          <CardContent sx={{ flex: 1, height: 200 }}>
            <Stack spacing={2}>
              <Typography variant="h6" component="h3">
                {article.title}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                }}
              >
                {article.content}
              </Typography>

              <Stack direction="row" spacing={1} alignItems="center">
                {!article.isPublished && (
                  <Chip
                    icon={<ScheduleIcon />}
                    label="下書き"
                    size="small"
                    color="default"
                  />
                )}

                {article._count?.products !== undefined &&
                  article._count.products > 0 && (
                    <Box display="flex" alignItems="center" gap={0.5}>
                      <LabelIcon fontSize="small" color="action" />
                      <Typography variant="caption" color="text.secondary">
                        {article._count.products}商品
                      </Typography>
                    </Box>
                  )}

                <Box sx={{ ml: "auto" }}>
                  <Typography variant="caption" color="text.secondary">
                    {new Date(article.createdAt).toLocaleDateString("ja-JP")}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
          {article.mainProductImageUrl && (
            <CardMedia
              component="img"
              sx={{ width: 160, height: 200 }}
              image={article.mainProductImageUrl}
              alt={article.title}
            />
          )}
        </Box>
      </CardActionArea>
    </Card>
  );
}
