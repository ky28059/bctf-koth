'use client'

import { useEffect, useState } from 'react';
import ChallengeScoreboardEntry from '@/app/ChallengeScoreboardEntry';
import type { ScoreboardEntry, ScoreboardMessage } from '@/server/scoreboard';
import { BACKEND_URL } from '@/util/config';


export default function ChallengeScoreboard(props: { id: string, className?: string }) {
    const [entries, setEntries] = useState<ScoreboardEntry[]>([]);

    useEffect(() => {
        const events = new EventSource(`${BACKEND_URL}/sse/scoreboard/${props.id}`);

        events.onmessage = (d) => {
            const msg: ScoreboardMessage = JSON.parse(d.data);
            switch (msg.type) {
                case 'all': return setEntries(msg.entries);
                case 'new':
                    return setEntries((s) => [...s, msg.entry]);
                case 'update':
                    return setEntries((s) => {
                        const i = s.findIndex(s => s.id === msg.entry.id);
                        if (i === -1) return s;
                        return s.with(i, msg.entry);
                    });
            }
        }
        return () => events.close();
    }, []);

    return (
        <aside className={'flex flex-col' + (props.className ? ` ${props.className}` : '')}>
            {entries.map((e, i) => (
                <ChallengeScoreboardEntry
                    rank={i + 1}
                    name={e.name}
                    score={e.score}
                    id={e.id}
                    key={e.id}
                />
            ))}
        </aside>
    )
}
