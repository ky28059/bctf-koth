'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Utils
import { AUTH_COOKIE_NAME, CTF_URL } from '@/util/config';


export async function logout() {
    const c = await cookies();
    c.delete(AUTH_COOKIE_NAME);

    return redirect('/');
}

export async function login() {
    const params = new URLSearchParams({
        state: 'a', // TODO
        redirect_uri: 'http://localhost:3000/auth'
    });
    return redirect(`${CTF_URL}/auth?${params}`);
}
