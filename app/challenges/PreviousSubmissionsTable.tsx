'use client'

import { useEffect, useState } from 'react';
import type { SubmissionMessage } from '@/server/submit';
import type { Submission } from '@/generated/prisma/client';


type PreviousSubmissionsTableProps = {
    id: string
}

export default function PreviousSubmissionsTable(props: PreviousSubmissionsTableProps) {
    const [submissions, setSubmissions] = useState<Submission[]>([]);

    useEffect(() => {
        const events = new EventSource(`http://localhost:8000/sse/submissions/${props.id}`, {
            withCredentials: true
        });

        events.onmessage = (d) => {
            const msg: SubmissionMessage = JSON.parse(d.data);
            if (msg.type === 'all') return setSubmissions(msg.submissions);
            if (msg.type === 'new')
                return setSubmissions((s) => [...s, msg.submission]);
        }
        return () => events.close();
    }, [])

    return (
        <table className="w-full border border-tertiary">
            <thead>
            <tr className="border-b border-tertiary">
                <th className="px-2 w-12 text-right">#</th>
                <th className="px-2 w-48 text-left font-semibold">Submission ID</th>
                <th className="px-2 w-36 text-left font-semibold">Length</th>
                <th className="px-2 w-36 text-left font-semibold">Score</th>
                <th className="px-2 text-left font-semibold">Time</th>
            </tr>
            </thead>
            <tbody>
            {submissions.toReversed().map((s, i) => (
                <tr key={s.id} className="bg-black/10">
                    <td className="text-secondary text-right px-2">
                        {submissions.length - i}
                    </td>
                    <td className="px-2 py-0.5 line-clamp-1">
                        <a
                            href={`/submission/${s.id}`}
                            className="text-blue-400 hover:underline"
                        >
                            {s.id}
                        </a>
                    </td>
                    <td className="px-2">{s.body.length}</td>
                    <td className="px-2">...</td>
                    <td className="px-2">{s.ts as unknown as string}</td>{/* TODO: fix serialization typing later */}
                </tr>
            ))}
            </tbody>
        </table>
    )
}
