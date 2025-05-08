import { getToken } from 'next-auth/jwt';
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/profile', '/home', '/course', '/id'];
const onlyAdmin = ['/id', '/admin'];
const adminEmail = 'test@gmail.com';

async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    const isAuth = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });

    if (!isAuth && protectedRoutes.some((route) => pathname.startsWith(route))) {
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    if (onlyAdmin.some((route) => pathname.startsWith(route))) {
        if (isAuth?.email !== adminEmail) {
            return NextResponse.redirect(new URL('/home', request.url));
        }
    }

    if (isAuth && (pathname.startsWith('/auth') || pathname === '/')) {
        return NextResponse.redirect(new URL('/home', request.url));
    }

    return NextResponse.next();
}

export default withAuth(middleware, {
    callbacks: {
        async authorized() {
            return true;
        }
    }
});

export const config = {
    matcher: ['/profile/:path*', '/auth/:path*', '/', '/home', '/course/:path*', '/id/:path*', '/admin/:path*']
};
