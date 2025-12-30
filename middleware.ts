import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simplified middleware that doesn't use Prisma (Edge runtime compatible)
export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Public routes - allow through
  if (
    pathname.startsWith("/auth") ||
    pathname === "/" ||
    pathname.startsWith("/api/auth")
  ) {
    return NextResponse.next();
  }
  
  // For protected routes, we'll check auth in the page components
  // Middleware can't use Prisma (Edge runtime limitation)
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};

