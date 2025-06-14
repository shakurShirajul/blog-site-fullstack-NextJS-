import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const pathname = req.nextUrl.pathname;

  // Match /blog/create or /blog/<24-hex-id>
  const isCreate = pathname === "/blog/create";
  const isBlogId = /^\/blog\/[a-f0-9]{24}$/.test(pathname);

  if ((isCreate || isBlogId) && !(await getToken({ req }))) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog/create", "/blog/:id([a-f0-9]{24})"],
};
