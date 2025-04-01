// import { NextRequest, NextResponse } from 'next/server'
// import { decrypt } from '@/lib/session'
// import { cookies } from 'next/headers'

// // 1. Specify protected and public routes
// const protectedRoutes = ['/dashboard']
// const publicRoutes = ['/login', '/signup', '/']

// export default async function middleware(req: NextRequest) {
//   // 2. Check if the current route is protected or public
//   const path = req.nextUrl.pathname
//   const isProtectedRoute = protectedRoutes.includes(path)
//   const isPublicRoute = publicRoutes.includes(path)

//   // 3. Decrypt the session from the cookie
//   const cookie = (await cookies()).get('session')?.value
//   const session = await decrypt(cookie)

//   // 4. Redirect to /login if the user is not authenticated
//   if (isProtectedRoute && !session?.userId) {
//     return NextResponse.redirect(new URL('/login', req.nextUrl))
//   }

//   // 5. Redirect to /dashboard if the user is authenticated
//   if (
//     isPublicRoute &&
//     session?.userId &&
//     !req.nextUrl.pathname.startsWith('/dashboard')
//   ) {
//     return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
//   }

//   return NextResponse.next()
// }

// // Routes Middleware should not run on
// export const config = {
//   matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
// }

// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { getSession } from "@/lib/auth";

// export async function middleware(request: NextRequest) {
//   const session = await getSession(request);
//   const publicPaths = ["/"];
//   const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

//   // Allow access to home page without authentication
//   if (isPublicPath) {
//     return NextResponse.next();
//   }

//   // Protected routes
//   if (
//     !session &&
//     !request.nextUrl.pathname.startsWith("/Login") &&
//     !request.nextUrl.pathname.startsWith("/Register") &&
//     !request.nextUrl.pathname.startsWith("/Forgotpassword") &&
//     !request.nextUrl.pathname.startsWith("/Resetpassword") &&
//     request.nextUrl.pathname.startsWith("/Show")
//   ) {
//     return NextResponse.redirect(new URL("/Login", request.url));
//   }

//   // Admin-only routes
//   if (
//     request.nextUrl.pathname.startsWith("/Admin") &&
//     session?.role !== "Admin"
//   ) {
//     return NextResponse.redirect(new URL("/Login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
// };

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await getSession(request);
  const publicPaths = ["/"];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  // Cho phép truy cập trang chủ mà không cần xác thực
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Đường dẫn bảo vệ: /Show hoặc /Admin
  if (
    !session &&
    (request.nextUrl.pathname.startsWith("/Show") ||
      request.nextUrl.pathname.startsWith("/Admin"))
  ) {
    // Lưu trữ URL ban đầu để chuyển hướng sau khi đăng nhập
    const url = request.nextUrl.clone();
    url.pathname = "/Login";
    url.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.rewrite(url);
  }

  // Đường dẫn chỉ dành cho quản trị viên
  if (
    request.nextUrl.pathname.startsWith("/Admin") &&
    session?.role !== "Admin"
  ) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
