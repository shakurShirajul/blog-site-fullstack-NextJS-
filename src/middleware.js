import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  console.log("Middleware running for:", req.nextUrl.pathname);

  const token = await getToken({ req });
  const isProtected = req.nextUrl.pathname.startsWith("/create-blog"); // add more routes as needed

  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/create-blog/:path*"], // add more patterns as needed
};
