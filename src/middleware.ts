import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Get the pathname
  const { pathname } = request.nextUrl;

  // Redirect root URL to master-landing-page
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/master-landing-page", request.url));
  }

  // Public routes that don't require authentication
  const publicRoutes = ["/sign-in"];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Get the access token from cookies
  const accessToken = request.cookies.get("accesstoken")?.value;

  // If user is not authenticated and trying to access a protected route
  if (!accessToken && !isPublicRoute) {
    // Redirect to sign-in page
    const signInUrl = new URL("/sign-in", request.url);
    // Optionally, you can add a redirect parameter to return to the original page after login
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // If user is authenticated and trying to access sign-in page, redirect to master-landing-page
  if (accessToken && pathname === "/sign-in") {
    return NextResponse.redirect(new URL("/master-landing-page", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
