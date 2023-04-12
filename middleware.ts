import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // if (req.nextUrl.pathname.startsWith("/checkout/")) {
  //   const token = req.cookies.get("token")?.value || "";

  //   try {
  //     await jwtVerify(
  //       token,
  //       new TextEncoder().encode(process.env.JWT_SECRET_SEED)
  //     );
  //     return NextResponse.next();
  //   } catch (error) {
  //     return NextResponse.redirect(
  //       new URL(`/auth/login?p=${req.nextUrl.pathname}`, req.url)
  //     );
  //   }
  // }

  const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  if (!session) {
    const requestedPage = req.nextUrl.pathname;
    const url = req.nextUrl.clone();
    url.pathname = `/auth/login`;
    url.search = `p=${requestedPage}`;

    return NextResponse.redirect(url);
  }

  const cart = req.cookies.get("cart");
  if (!cart || cart.value === "[]") {
    const url = req.nextUrl.clone();
    url.pathname = "/cart/empty";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/checkout/address", "/checkout/summary"],
};
