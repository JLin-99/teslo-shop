import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/checkout/")) {
    const token = req.cookies.get("token")?.value || "";

    try {
      await jwtVerify(
        token,
        new TextEncoder().encode(process.env.JWT_SECRET_SEED)
      );
      return NextResponse.next();
    } catch (error) {
      return NextResponse.redirect(
        new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/address", "/checkout/summary"],
};
