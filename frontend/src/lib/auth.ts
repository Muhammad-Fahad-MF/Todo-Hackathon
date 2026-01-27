import { createAuthClient } from "better-auth/react";

const baseURL = process.env.NEXT_PUBLIC_APP_URL;
if (!baseURL) {
  throw new Error("NEXT_PUBLIC_APP_URL is not defined");
}

export const authClient = createAuthClient({
  baseURL,
  refetchInterval: 0, // Disable polling
});

export const { useSession, signIn, signOut, signUp } = authClient;