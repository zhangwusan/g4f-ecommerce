import { NextRequest, NextResponse } from 'next/server';

export async function user_middleware(req: NextRequest) {
    const token = req.cookies.get('__Secure-next-auth.session-token')?.value || req.cookies.get('next-auth.session-token')?.value;

    if (!token) {
        const loginUrl = new URL('/auth/login', req.url);
        loginUrl.searchParams.set('callbackUrl', req.url);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
}