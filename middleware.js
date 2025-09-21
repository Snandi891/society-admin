import { NextResponse } from "next/server";

export function middleware(req) {
  const loggedIn = req.cookies.get("loggedIn")?.value;

  if (loggedIn !== "true") {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Only run middleware for /admin routes
export const config = {
  matcher: ["/admin/:path*"],
};
