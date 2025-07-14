import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export default async function IndexPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const users = await prisma.user.findMany();

  return (
    <div>
      <h1>Index Page</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
}
