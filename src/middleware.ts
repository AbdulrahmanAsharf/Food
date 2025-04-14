
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "@prisma/client"; 
import { Routes, Pages } from "@/constants/enums";


const intlMiddleware = createMiddleware(routing);

export default withAuth(
  async function middleware(request: NextRequest) {

    const response = intlMiddleware(request);

    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-url", request.url);

    const pathname = request.nextUrl.pathname;
    const pathnameSegments = request.url.split("/");
    const currentLocale = pathnameSegments[3] || "en";


    const isAuth = await getToken({ req: request });
    const isAuthPage = pathname.startsWith(`/${currentLocale}/${Routes.AUTH}`);
    const protectedRoutes = [Routes.PROFILE, Routes.ADMIN];
    const isProtectedRoute = protectedRoutes.some((route) =>
      pathname.startsWith(`/${currentLocale}/${route}`)
    );


    if (!isAuth && isProtectedRoute) {
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.AUTH}/${Pages.LOGIN}`, request.url)
      );
    }


    if (isAuthPage && isAuth) {
      const role = isAuth.role;
      if (role === UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.ADMIN}`, request.url)
        );
      }
      return NextResponse.redirect(
        new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
      );
    }


    if (isAuth && pathname.startsWith(`/${currentLocale}/${Routes.ADMIN}`)) {
      if (isAuth.role !== UserRole.ADMIN) {
        return NextResponse.redirect(
          new URL(`/${currentLocale}/${Routes.PROFILE}`, request.url)
        );
      }
    }

    return response; 
  },
  {
    callbacks: {
      authorized: () => true, 
    },
  }
);


export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)", // ✅ تطبيق الميدلوير على جميع الصفحات ما عدا الملفات الثابتة
  ],
};

