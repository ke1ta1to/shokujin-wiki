import { ReviewContent } from "@/components/pages/reviews/review-content";

export default async function ReviewPage(
  props: PageProps<"/reviews/[reviewId]">,
) {
  const { reviewId } = await props.params;

  return <ReviewContent reviewId={parseInt(reviewId)} />;
}
