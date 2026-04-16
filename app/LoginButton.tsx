'use client'

import { login } from '@/util/auth';


export default function LoginButton() {
    return (
        <button
            className="cursor-pointer ml-auto text-primary hover:text-inherit px-4 transition duration-100"
            onClick={login}
        >
            Log in
        </button>
    )
}
