'use client'

import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';
import 'prismjs/components/prism-python';

// Components
import ChallengeScoreboardEntry from '@/app/challenges/ChallengeScoreboardEntry';


export default function ChallengeInterface() {
    const [code, setCode] = useState('');

    return (
        <div className="flex gap-8">
            <div>
                <h1 className="text-3xl font-bold mb-4">
                    Polyglot
                </h1>
                <p>
                    Write a polyglot that compiles / runs in as many of the following languages as possible:
                    [...]. In each language, your code should read 3 values a, b, and c from `stdin` then output `a^b%c` to
                    `stdout`. [...]
                </p>

                <Editor
                    value={code}
                    onValueChange={(code) => setCode(code)}
                    highlight={(code) => highlight(code, languages.python, 'python')}
                    padding={{
                        top: '0.75rem',
                        bottom: '0.75rem',
                        left: '1.5rem',
                        right: '1.5rem',
                    }}
                    style={{ fontFamily: '"Fira code", "Fira Mono", monospace' }}
                    className="bg-[#121314] text-[#BBBEBF] border border-tertiary mt-6"
                >
                    {code}
                </Editor>

                <button
                    className="cursor-pointer bg-blue-500 text-white rounded mt-4 px-3 py-1.5"
                    onClick={() => {/* TODO */}}
                >
                    Submit
                </button>
            </div>

            <aside className="border-l border-tertiary flex-none flex flex-col max-h-screen overflow-y-auto sticky top-0">
                {Array(100).fill(0).map((_, i) => (
                    <ChallengeScoreboardEntry
                        rank={i + 1}
                        avatarUrl="/assets/b01lers.png"
                        name="b01lers"
                        score={15}
                        key={i}
                    />
                ))}
            </aside>
        </div>
    )
}
