'use client'

import { useEffect, useState } from 'react';
import ChallengeScoreboardEntry from '@/app/ChallengeScoreboardEntry';
import type { ScoreboardEntry, ScoreboardMessage } from '@/server/scoreboard';
import { BACKEND_URL } from '@/util/config';


export default function ChallengeScoreboard(props: { id: string, className?: string }) {
    const [entries, setEntries] = useState<ScoreboardEntry[]>([]);

    // Sort by primary score, then by secondary score
    // TODO: display tertiary tiebreak on time
    function sortEntries(a: ScoreboardEntry, b: ScoreboardEntry) {
        const [a1, a2] = a.score;
        const [b1, b2] = b.score;
        return a2 - a1 || b2 - b1;
    }

    useEffect(() => {
        const events = new EventSource(`${BACKEND_URL}/sse/scoreboard/${props.id}`);

        events.onmessage = (d) => {
            const msg: ScoreboardMessage = JSON.parse(d.data);
            switch (msg.type) {
                case 'all': return setEntries(msg.entries.sort(sortEntries));
                case 'new':
                    return setEntries((s) => [...s, msg.entry].sort(sortEntries));
                case 'update':
                    return setEntries((s) => {
                        const i = s.findIndex(s => s.id === msg.entry.id);
                        if (i === -1) return s;
                        return s.with(i, msg.entry).sort(sortEntries);
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
