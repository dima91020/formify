import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";

export default auth((request: NextAuthRequest) => {
    const { pathname } = request.nextUrl;
    const isLoggedIn = !!request.auth;

    if ((pathname.startsWith("/dashboard") || pathname.startsWith("/builder")) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    if (pathname.startsWith("/login") && isLoggedIn) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
})

export const config = {
    matcher: ["/dashboard/:path*", "/builder/:path*", "/login"],
}