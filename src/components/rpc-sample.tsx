"use client";

import { createClient } from "@supabase/supabase-js";
import { hc } from "hono/client";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";

import type { AppType } from "@/app/api/[...route]/route";

export function RpcSample() {
  const [reviews, setReviews] = useState<string | null>(null);
  const [me, setMe] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL as string,
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY as string,
      );

      {
        const client = hc<AppType>("/");
        const res = await client.api.reviews.$get();
        if (res.ok) {
          const data = await res.json();
          setReviews(JSON.stringify(data.reviews, null, 2));
        }
      }

      {
        const client = hc<AppType>("/", {
          headers: {
            Authorization: `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
          },
        });
        const session = await supabase.auth.getSession();
        if (session) {
          const res = await client.api.auth.me.$get();
          if (res.ok) {
            const data = await res.json();
            setMe(JSON.stringify(data.user, null, 2));
          } else if (res.status) {
          }
        }
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
      <h2>Me</h2>
      <pre>{me}</pre>
      <h2>Reviews</h2>
      <pre>{reviews}</pre>
    </div>
  );
}
