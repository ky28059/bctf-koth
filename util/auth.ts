'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Utils
import { AUTH_COOKIE_NAME } from '@/util/config';


export async function logout() {
    const c = await cookies();
    c.delete(AUTH_COOKIE_NAME);

    return redirect('/');
}
