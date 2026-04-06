'use client'

import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';

// Components
import LanguageSelector from '@/app/challenges/LanguageSelector';
import PreviousSubmissionsTable from '@/app/challenges/PreviousSubmissionsTable';
import ChallengeScoreboard from '@/app/ChallengeScoreboard';

// Utils
import type { ChallengeData } from '@/util/challenges';
import type { SubmitPayload } from '@/server/submit';


export default function ChallengeInterface(props: ChallengeData) {
    const [code, setCode] = useState(props.starter);
    const [language, setLanguage] = useState('haskell');

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function submit() {
        setPending(true);
        const token = document.cookie.match(/ctf_clearance=(.+?)(?:$|;)/)![1];

        const res = await fetch('http://localhost:8000/submit', {
            method: 'POST',
            body: JSON.stringify({ body: code, chall: props.id } satisfies SubmitPayload),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            }
        });
        const data = await res.json();

        setPending(false);

        if (!res.ok)
            return setError(data.msg);

        setError(null);
        // TODO: toast
    }

    return (
        <div className="flex gap-8">
            <div className="pb-20">
                <h1 className="text-3xl font-bold mb-4">
                    {props.name}
                </h1>
                <p>{props.description}</p>

                <LanguageSelector
                    language={language}
                    setLanguage={setLanguage}
                />
                <Editor
                    value={code}
                    onValueChange={(code) => setCode(code)}
                    highlight={(code) => highlight(code, languages[language], language)}
                    padding={{
                        top: '0.75rem',
                        bottom: '0.75rem',
                        left: '1.5rem',
                        right: '1.5rem',
                    }}
                    style={{ fontFamily: '"Fira code", "Fira Mono", monospace' }}
                    className="bg-[#121314] text-[#BBBEBF] border border-tertiary mt-3 shadow-xl"
                >
                    {code}
                </Editor>
                <p className="mt-1 text-sm text-secondary">
                    {code.length} characters
                </p>

                <button
                    className="cursor-pointer bg-blue-500 text-white rounded mt-4 px-3 py-1.5 disabled:opacity-50 transition duration-100"
                    disabled={pending}
                    onClick={submit}
                >
                    Submit
                </button>
                {error && (
                    <p className="text-sm text-red-500 mt-1">{error}</p>
                )}

                <h2 className="font-bold text-xl mt-12 mb-3">
                    Previous submissions
                </h2>
                <PreviousSubmissionsTable id={props.id} />
            </div>

            <ChallengeScoreboard className="w-64 border-l border-tertiary flex-none max-h-screen overflow-y-auto sticky top-0" />
        </div>
    )
}
