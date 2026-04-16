import Link from 'next/link';
import { cookies } from 'next/headers';

// Components
import LogoutButton from '@/app/LogoutButton';
import LoginButton from '@/app/LoginButton';

// Utils
import { AUTH_COOKIE_NAME } from '@/util/config';


export default async function Header() {
    const c = await cookies();
    const authed = c.has(AUTH_COOKIE_NAME);

    return (
        <header className="flex gap-4 items-center px-16 py-1 border-b border-tertiary">
            <Link href="/" className="flex gap-3 items-center">
                <img
                    src="/assets/logo-uwu.png"
                    alt="logo"
                    className="h-16"
                />
                <h2 className="text-lg font-bold">b01lers CTF</h2>
            </Link>

            {authed ? (
                <>
                    <Link href="/challenges" className="px-2 text-primary hover:text-inherit transition duration-100">
                        Challenges
                    </Link>

                    <LogoutButton />
                </>
            ) : (
                <LoginButton />
            )}
        </header>
    )
}
