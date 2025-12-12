"use client";

import { hc } from "hono/client";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import type { AppType } from "@/app/api/[...route]/route";

export function RpcSample() {
  const [reviews, setReviews] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const client = hc<AppType>("/");
      const res = await client.api.reviews.$get();
      if (res.ok) {
        const data = await res.json();
        setReviews(JSON.stringify(data.reviews, null, 2));
      }
    })();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());
    const client = hc<AppType>("/");
    await client.api.reviews.$post({
      json: { content: data.content as string },
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea name="content" rows={4} cols={50} />
        <br />
        <button type="submit">Submit Review</button>
      </form>
      <pre>{reviews}</pre>
    </div>
  );
}
