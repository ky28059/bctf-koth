'use client'

import { useState } from 'react';
import ChallengeInterface from '@/app/challenges/ChallengeInterface';


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
                name={challenge.name}
                description={challenge.description}
                key={challenge.name}
            />
        </>
    )
}

const challenges = [{
    name: 'Polyglot',
    description: 'Write a polyglot that compiles / runs in as many of the following languages as possible: [...]. In each language, your code should read 3 values a, b, and c from `stdin` then output `a^b%c` to `stdout`. [...]'
}, {
    name: 'Pickle golf',
    description: '...'
}, {
    name: 'Shell polyglot',
    description: '...'
}]
