import { drizzle } from "drizzle-orm/libsql";

const db = drizzle("file:local.db");

export default db;
