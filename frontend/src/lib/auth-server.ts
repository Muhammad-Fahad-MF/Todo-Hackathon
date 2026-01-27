import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Neon DB requires SSL. This ensures SSL is enabled if the database URL is not localhost.
  ssl: process.env.DATABASE_URL?.includes("localhost")
    ? undefined
    : { rejectUnauthorized: false },
});

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
  },
  plugins: [
    nextCookies(),
  ],
});
