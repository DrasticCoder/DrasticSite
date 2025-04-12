import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const host = req.headers.get('host') || '';
  const url = req.nextUrl.clone();

  // For local dev, handles .localhost:3000
  const dev = process.env.NODE_ENV !== 'production';
  const baseDomain = dev ? 'localhost:3000' : 'site.drasticcoder.in';

  const isSubdomain = host.endsWith(baseDomain) && host !== baseDomain;

  if (isSubdomain) {
    const subdomain = host.replace(`.${baseDomain}`, '');

    // Rewrite to subdomain route and pass subdomain as query param
    url.pathname = `/subdomain`;
    url.searchParams.set('site', subdomain);
    return NextResponse.rewrite(url);
  }

  // Normal routing otherwise
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|api|favicon.ico|form|public).*)'],
};
