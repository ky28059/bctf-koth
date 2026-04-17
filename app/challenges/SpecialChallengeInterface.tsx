'use client'

import { ChangeEvent, useState } from 'react';

// Utils
import type { SpecialChallengeData } from '@/util/challenges';
import type { SubmitPayload } from '@/server/submit';
import { useToast } from '@/contexts/ToastContext';
import { BACKEND_URL } from '@/util/config';


export default function SpecialChallengeInterface(props: SpecialChallengeData) {
    const [bytes, setBytes] = useState<Uint8Array | null>(null);
    const [dragging, setDragging] = useState(false);

    const [pending, setPending] = useState(false);

    const { toast } = useToast();

    async function submit() {
        if (!bytes) return;
        setPending(true);

        const res = await fetch(`${BACKEND_URL}/submit`, {
            method: 'POST',
            body: JSON.stringify({
                body: bytes.toBase64(),
                chall: props.id
            } satisfies SubmitPayload),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await res.json();

        setPending(false);

        if (!res.ok)
            return toast({ success: false, title: `Error submitting to ${props.name}`, description: data.msg })

        toast({ success: true, title: `Successfully submitted to ${props.name}`, description: 'Your submission will be scored soon.' })
    }

    async function handleFile(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const buf = await file.bytes();
        setBytes(buf);
    }

    return (
        <>
            <input
                type="file"
                className={'mt-8 w-full flex items-center justify-center rounded-md border-2 border-dashed px-12 py-12 text-secondary file:mr-3 file:text-primary file:font-medium bg-[repeating-linear-gradient(135deg,#40404011,#40404011_10px,transparent_10px,transparent_20px)] transition duration-100 ' + (dragging ? 'border-blue-400' : 'border-tertiary')}
                onChange={handleFile}
                onDragEnter={() => setDragging(true)}
                onDragLeave={() => setDragging(false)}
                onDrop={() => setDragging(false)}
            />
            <p className="mt-1 text-sm text-secondary">
                {bytes?.length ?? 0} bytes
            </p>

            <button
                className="cursor-pointer bg-blue-500 text-white rounded mt-4 px-3 py-1.5 disabled:opacity-50 transition duration-100"
                disabled={!bytes || bytes.length === 0 || pending}
                onClick={submit}
            >
                Submit
            </button>
        </>
    )
}
