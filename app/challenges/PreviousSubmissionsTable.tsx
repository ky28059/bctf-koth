'use client'

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
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
            switch (msg.type) {
                case 'all': return setSubmissions(msg.submissions);
                case 'new':
                    return setSubmissions((s) => [...s, msg.submission]);
                case 'update':
                    return setSubmissions((s) => {
                        const i = s.findIndex(s => s.id === msg.submission.id);
                        if (i === -1) return s;
                        return s.with(i, msg.submission);
                    });
            }
        }
        return () => events.close();
    }, [])

    return (
        <table className="w-full border border-tertiary text-sm">
            <thead>
            <tr className="border-b border-tertiary text-primary text-sm">
                <th className="px-2 w-12 text-right">#</th>
                <th className="py-1 px-2 w-48 text-left font-semibold">Submission ID</th>
                <th className="px-2 w-24 text-left font-semibold">Length</th>
                <th className="px-2 w-20 text-left font-semibold">Status</th>
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
                    <td className="px-2 py-1 line-clamp-1">
                        <a
                            href={`/submission/${s.id}`}
                            className="text-blue-400 hover:underline"
                        >
                            {s.id}
                        </a>
                    </td>
                    <td className="px-2">{s.body.length}</td>
                    <td className="px-2">
                        {s.status === 'QUEUED' ? (
                            <span className="bg-amber-500/20 text-amber-500 rounded-full text-xs px-1.5 py-0.5">
                                In queue
                            </span>
                        ) : s.status === 'TESTING' ? (
                            <span className="bg-yellow-500/20 text-yellow-500 rounded-full text-xs px-1.5 py-0.5">
                                Testing
                            </span>
                        ) : s.error ? (
                            <span className="bg-red-500/20 text-red-500 rounded-full text-xs px-1.5 py-0.5">
                                Error
                            </span>
                        ) : (
                            <span className="bg-lime-500/20 text-lime-500 rounded-full text-xs px-1.5 py-0.5">
                                Scored
                            </span>
                        )}
                    </td>
                    <td className="px-2">
                        {s.score[0] ?? '-'}
                        {s.score.length > 1 && (
                            <span className="text-secondary ml-1">({s.score[1]})</span>
                        )}
                    </td>
                    <td className="px-2 text-primary">
                        {DateTime.fromISO(s.ts as unknown as string).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
                    </td>{/* TODO: fix serialization typing later */}
                </tr>
            ))}
            </tbody>
        </table>
    )
}
