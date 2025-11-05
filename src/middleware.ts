import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const middleware = async (request: NextRequest) => {
  const pathname = request.nextUrl.pathname;
  const sessionCookie = request.cookies.get('language')?.value || 'de';
  const pathnameIsMissingLocale = ['de', 'en', 'fr'].every(
    (locale) =>
      !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`,
  );

  if (pathnameIsMissingLocale) {
    return NextResponse.redirect(
      new URL(`/${sessionCookie || 'de'}${pathname}`, request.url),
    );
  }
  return NextResponse.next();
};

export default middleware;

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
