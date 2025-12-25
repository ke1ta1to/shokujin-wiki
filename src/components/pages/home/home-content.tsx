"use client";

import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";

import type { paths } from "@/lib/api";

const fetchClient = createFetchClient<paths>({
  baseUrl: "/api",
});
const $api = createClient(fetchClient);

export function HomeContent() {
  const { data: reviews, error, isLoading } = $api.useQuery("get", "/reviews");
  if (isLoading || !reviews) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {String(error)}</div>;
  }
  return <pre>{JSON.stringify(reviews, null, 2)}</pre>;
}
