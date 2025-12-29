import { ReviewContent } from "@/components/pages/reviews/review-content";

export default async function ReviewPage(
  props: PageProps<"/reviews/[reviewId]">,
) {
  const { reviewId } = await props.params;

  return (
    <div className="max-w-2xl mx-auto">
      <ReviewContent reviewId={parseInt(reviewId)} />
    </div>
  );
}
