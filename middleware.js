import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    const { pathname } = req.nextUrl;

    // List of public paths that don't require authentication
    const publicPaths = ["/", "/auth/signin", "/auth/register"];

    // Check if the current path is public
    const isPublicPath = publicPaths.includes(pathname) || pathname.startsWith("/auth/");

    // 1. If user is authenticated and tries to access public pages (like / or /auth/signin)
    if (token && isPublicPath) {
        return NextResponse.redirect(new URL("/home", req.url));
    }

    // 2. If user is NOT authenticated and tries to access protected pages
    if (!token && !isPublicPath) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public images/assets if any (e.g. *.png, *.jpg)
         */
        "/((?!api|_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg|.*\\.gif|.*\\.svg).*)",
    ],
};
