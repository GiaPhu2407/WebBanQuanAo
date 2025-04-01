// middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const publicPaths = ["/", "/Show", "/Login", "/Register", "/ForgotPassword"];
  const isPublicPath = publicPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Protected paths: /Show or /Admin
  if (!session) {
    // Store original URL to redirect after login
    const loginUrl = new URL("/Login", request.url);
    // loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    // return NextResponse.redirect(loginUrl);
  }

  // Admin-only paths
  if (
    request.nextUrl.pathname.startsWith("/Admin") &&
    session.role !== "Admin"
  ) {
    // Redirect to unauthorized page or home
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
