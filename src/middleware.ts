// src/middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);
export const runtime = 'experimental-edge';
export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect(); // ✅ sin paréntesis después de auth
  }
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/"],
};
