import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

// Protect contributor and admin areas. The public catalogue stays open.
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const role = (req.auth?.user as { role?: string } | undefined)?.role;

  const path = nextUrl.pathname;
  const needsAuth = path.startsWith("/contribuer") || path.startsWith("/compte") || path.startsWith("/admin");
  const needsAdmin = path.startsWith("/admin");

  if (needsAuth && !isLoggedIn) {
    const url = new URL("/connexion", nextUrl);
    url.searchParams.set("callbackUrl", path);
    return NextResponse.redirect(url);
  }

  if (needsAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/", nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
