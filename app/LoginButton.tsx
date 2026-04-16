'use client'

import { logout } from '@/util/auth';


export default function LoginButton() {
    async function loginCallback() {
        // setOpen(false);
        await logout();
    }

    return (
        <button
            className="cursor-pointer ml-auto text-primary hover:text-inherit px-4 transition duration-100"
            onClick={loginCallback}
        >
            Log in
        </button>
    )
}
