import { createClient } from "@/utils/supabase/server";

export default async function IndexPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div>
      <h1>Index Page</h1>

      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
