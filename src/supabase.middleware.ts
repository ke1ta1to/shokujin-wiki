import { bearerAuth } from "hono/bearer-auth";

export const supabaseAuth = bearerAuth({
  verifyToken: async (token, c) => {
    const supabase = c.get("supabase");
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) return false;
    c.set("supabaseUser", data.user);
    return true;
  },
});
