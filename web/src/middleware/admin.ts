import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { RoleEnum } from '@/lib/enum/role';

export async function admin_middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  if (!token) {
    const loginUrl = new URL('/auth/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.url);
    return NextResponse.redirect(loginUrl);
  }

  if (token.role !== RoleEnum.ADMIN) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return NextResponse.next();
}