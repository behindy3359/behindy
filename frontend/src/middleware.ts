import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 인증이 필요한 페이지들 (Cookie 기반으로만 확인)
  const protectedPaths = ['/dashboard', '/character/create'];

  // 인증된 사용자가 접근하면 안 되는 페이지들 (로그인, 회원가입 등)
  const authOnlyPaths = ['/auth/login', '/auth/signup'];

  // refreshToken Cookie 확인 (HttpOnly Cookie)
  const refreshToken = request.cookies.get('refreshToken')?.value;
  const isAuthenticated = Boolean(refreshToken);

  // 보호된 페이지에 비인증 사용자가 접근할 때 (Cookie 기반으로만)
  if (protectedPaths.some(path => pathname.startsWith(path)) && !isAuthenticated) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 인증된 사용자가 인증 페이지에 접근할 때
  if (authOnlyPaths.some(path => pathname.startsWith(path)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};