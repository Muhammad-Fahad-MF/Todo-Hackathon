import { createBetterAuthMiddleware } from "better-auth/next";

export const middleware = createBetterAuthMiddleware({
  basePath: "/auth",
  publicRoutes: ["/auth/login", "/auth/signup"],
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
