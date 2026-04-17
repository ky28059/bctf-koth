'use client'

import { useEffect, useState } from 'react';

type SubmissionDownloadLinkProps = {
    id: string,
    body: string
}

export default function SubmissionDownloadLink(props: SubmissionDownloadLinkProps) {
    const [url, setUrl] = useState('');

    useEffect(() => {
        if (!props.body) return;

        // Can't use `atob` here to decode the body as `atob` does not handle UTF-8 strings correctly
        const blob = new Blob([Uint8Array.fromBase64(props.body)], { type: 'application/zstd' });
        const url = URL.createObjectURL(blob);
        setUrl(url);

        return () => URL.revokeObjectURL(url);
    }, [props.body]);

    return (
        <a
            className="text-sm text-primary flex items-center justify-center rounded border border-dashed border-tertiary h-20 bg-[repeating-linear-gradient(135deg,#40404011,#40404011_10px,transparent_10px,transparent_20px)]"
            href={url}
            download={`${props.id}.zst`}
        >
            Download file (zstd compressed)
        </a>
    )
}
