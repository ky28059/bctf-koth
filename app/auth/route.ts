import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { AUTH_COOKIE_NAME } from '@/util/config';


/**
 * Hook into bCTF OAuth; see {@link https://github.com/ky28059/bctf/blob/main/app/auth/route.ts}.
 */
export async function GET(req: NextRequest) {
    const c = await cookies();

    const params = req.nextUrl.searchParams;
    const state = params.get('state');
    const token = params.get('token');

    if (!token || !state)
        return NextResponse.redirect(new URL('/', req.url));

    c.set(AUTH_COOKIE_NAME, token, {
        maxAge: 16070400,
        // sameSite: 'none',
        // secure: true
        domain: '.b01lersc.tf'
    });

    return NextResponse.redirect(new URL('/challenges', req.url));
}
