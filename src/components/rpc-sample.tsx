"use client";

import { hc } from "hono/client";
import { useEffect, useState } from "react";

import type { AppType } from "@/app/api/[...route]/route";

export function RpcSample() {
  const [message, setMessage] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const client = hc<AppType>("/");
      const res = await client.api.hello.$get({ query: { name: "Shokujin" } });
      if (res.ok) {
        const data = await res.json();
        setMessage(data.message);
      }
    })();
  }, []);
  return <div>RPC Sample Component: {message}</div>;
}
