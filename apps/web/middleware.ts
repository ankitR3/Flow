import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    const isLandingPage = req.nextUrl.pathname === '/';
    const isDashboard = req.nextUrl.pathname.startsWith('/dashboard');

    // logged in → redirect away from landing
    if (token && isLandingPage) {
        return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    // not logged in → redirect away from dashboard
    if (!token && isDashboard) {
        return NextResponse.redirect(new URL('/', req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/', '/dashboard/:path*'],
};