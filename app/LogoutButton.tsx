'use client'

import { useState } from 'react';
import { Dialog } from 'radix-ui';

// Components
import CenteredModal from '@/components/CenteredModal';

// Utils
import { logout } from '@/util/auth';


export default function LogoutButton() {
    const [open, setOpen] = useState(false);

    async function logoutCallback() {
        setOpen(false);
        await logout();
    }

    return (
        <>
            <button
                className="cursor-pointer ml-auto text-primary hover:text-inherit px-4 transition duration-100"
                onClick={() => setOpen(true)}
            >
                Log out
            </button>

            <CenteredModal
                className="bg-midnight rounded-lg px-12 py-8 text-white shadow-lg w-full max-w-xl max-h-[90%]"
                open={open}
                setOpen={setOpen}
            >
                <Dialog.Title className="text-2xl font-bold mb-4">
                    Log out
                </Dialog.Title>
                <p className="text-primary mb-4">
                    This will log you out on your current device.
                </p>

                <div className="flex gap-2 justify-end">
                    <button
                        className="cursor-pointer border border-primary text-primary px-4 py-2 rounded hover:bg-primary hover:text-midnight transition duration-100"
                        onClick={() => setOpen(false)}
                    >
                        Cancel
                    </button>

                    <button
                        className="cursor-pointer border border-red-500 text-red-500 px-4 py-2 rounded hover:bg-red-500 hover:text-midnight transition duration-100"
                        onClick={logoutCallback}
                    >
                        Log out
                    </button>
                </div>
            </CenteredModal>
        </>
    )
}
