import { NextResponse } from "next/server";
import NextAuth from "next-auth";
import authConfig from "@/auth.config";
import {
  publicRoutes,
  authRoutes,
  apiAuthPrefix,
  DEFAULT_SIGN_IN_REDIRECT,
} from "@/lib/routes";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isSignedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  if (isAuthRoute) {
    if (isSignedIn) {
      return NextResponse.redirect(new URL(DEFAULT_SIGN_IN_REDIRECT, nextUrl));
    }
    return NextResponse.next();
  }

  if (!isSignedIn && !isPublicRoute) {
    return NextResponse.redirect(new URL("/sign-in", nextUrl));
  }
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
  unstable_allowDynamic: ["/node_modules/mongoose/dist/browser.umd.js"],
};
