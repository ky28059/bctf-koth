'use client'

import { useState } from 'react';
import ChallengeInterface from '@/app/challenges/ChallengeInterface';
import { challenges } from '@/util/challenges';


export default function ChallengesContent() {
    const [challenge, setChallenge] = useState(challenges[0]);

    return (
        <>
            <div className="mb-10 flex flex-wrap gap-2">
                {challenges.map((c) => (
                    <button
                        className={'cursor-pointer rounded border px-2 py-1' + (challenge.name === c.name ? '' : ' opacity-50 hover:opacity-100 transition duration-200')}
                        onClick={() => setChallenge(c)}
                        key={c.name}
                    >
                        {c.name}
                    </button>
                ))}
            </div>

            <ChallengeInterface
                id={challenge.id}
                name={challenge.name}
                description={challenge.description}
                key={challenge.id}
            />
        </>
    )
}
