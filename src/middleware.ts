// middleware.ts
import { clerkMiddleware } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/clerk-sdk-node';
import { NextResponse } from 'next/server';

export default clerkMiddleware(async (auth, req) => {
 const publicPaths = [
  '/',
  '/menu',
  '/about',
  '/contact',
  '/sign-in',
  '/sign-up',
  '/verify-email',
  '/api/set-role' // ✅ أضفها هنا
];


  const url = req.nextUrl.pathname;
  if (publicPaths.includes(url)) {
    return NextResponse.next(); // السماح للمسارات العامة
  }

  const { userId } = await auth();

  if (!userId) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  const user = await clerkClient.users.getUser(userId);
  const role = user.publicMetadata?.role;
  const emailVerified = user.emailAddresses[0]?.verification?.status === 'verified';

  // لو الإيميل مش متأكد منه وبيحاول يدخل غير /verify-email
  // لو الإيميل مش متأكد منه وبيحاول يدخل غير /verify-email
if (!emailVerified) {
  if (url !== '/verify-email') {
    return NextResponse.redirect(new URL('/verify-email', req.url));
  }
} else {
  // ✅ الإيميل متحقق منه، امنعه من الدخول على /verify-email تاني
  if (url === '/verify-email') {
    return NextResponse.redirect(new URL('/profile', req.url));
  }
}


  // حماية صفحة /admin
  if (url.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!.+\\.[\\w]+$|_next).*)', // كل الصفحات ما عدا الملفات الثابتة
    '/',
    '/(api|trpc)(.*)',
  ],
};
