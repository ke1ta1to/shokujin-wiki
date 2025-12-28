"use client";

import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import { ReviewPreview } from "@/features/reviews/components/review-preview";
import type { paths } from "@/lib/api";

const fetchClient = createFetchClient<paths>({
  baseUrl: "/api",
});
const $api = createClient(fetchClient);

export function HomeContent() {
  const { data, error, isLoading } = $api.useQuery("get", "/reviews");
  if (isLoading || !data) {
    return null;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }
  return (
    <div className="divide-y">
      {data.reviews.map((review) => (
        <div key={review.id} className="py-2">
          <ReviewPreview id={review.id} comment={review.comment} />
        </div>
      ))}
    </div>
  );
}
