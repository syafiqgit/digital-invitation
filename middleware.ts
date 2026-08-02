import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const guest = searchParams.get("to");

  const requestHeaders = new Headers(request.headers);
  if (guest) {
    requestHeaders.set("x-guest-name", guest);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: "/",
};
