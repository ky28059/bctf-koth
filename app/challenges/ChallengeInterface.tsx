'use client'

import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';

// Components
import LanguageSelector from '@/app/challenges/LanguageSelector';
import PreviousSubmissionsTable from '@/app/challenges/PreviousSubmissionsTable';
import ChallengeScoreboardEntry from '@/app/challenges/ChallengeScoreboardEntry';


type ChallengeInterfaceProps = {
    name: string,
    description: string,
}

export default function ChallengeInterface(props: ChallengeInterfaceProps) {
    const [code, setCode] = useState(starter);
    const [language, setLanguage] = useState('haskell');

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
                    className="cursor-pointer bg-blue-500 text-white rounded mt-4 px-3 py-1.5"
                    onClick={() => {/* TODO */}}
                >
                    Submit
                </button>

                <h2 className="font-bold text-xl mt-12 mb-3">
                    Previous submissions
                </h2>
                <PreviousSubmissionsTable />
            </div>

            <aside className="w-64 border-l border-tertiary flex-none flex flex-col max-h-screen overflow-y-auto sticky top-0">
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

const starter = `main :: IO ()
main = getLine >>=
    (\\[a, b, c] -> print $ mod (a ^ b) c) . map (read :: String -> Int) . words`
