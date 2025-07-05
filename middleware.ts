// middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const publicPaths = [
    "/",
    "/ShowIntro",
    "/ShowBlog",
    "/ShowContact",
    "/Show",
    "/Admin",
    "/component/Category",
    "/component/shopping",
    "/component/Order",
    "/Login",
    "/Register",
    "/ForgotPassword",
    "/Staff",
    "/success",
    "/images/clothing",
    "/unauthorized",
  ];
  const isPublicPath = publicPaths.some(
    (path) =>
      request.nextUrl.pathname === path ||
      request.nextUrl.pathname.startsWith(`${path}/`)
  );

  // Allow access to public paths without authentication
  if (isPublicPath) {
    return NextResponse.next();
  }

  // If no session exists, redirect to login
  if (!session) {
    const loginUrl = new URL("/Login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin-only paths - check role
  if (request.nextUrl.pathname.startsWith("/Admin")) {
    // Only users with role "Admin" can access admin paths
    if (!session.role || session.role !== "Admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
};
