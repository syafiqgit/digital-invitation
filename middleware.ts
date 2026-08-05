import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const guest = request.nextUrl.searchParams.get("to");
  const response = NextResponse.next();

  if (guest) {
    response.headers.set("x-guest-name", guest);
  }

  return response;
}

export const config = {
  matcher: "/",
};
