'use client'

import { useState } from 'react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs';

// Components
import LanguageSelector from '@/app/challenges/LanguageSelector';

// Utils
import type { PolyglotChallengeData } from '@/util/challenges';
import type { SubmitPayload } from '@/server/submit';
import { useToast } from '@/contexts/ToastContext';


export default function PolyglotChallengeInterface(props: PolyglotChallengeData) {
    const [code, setCode] = useState(props.starter);
    const [submitLanguages, setSubmitLanguages] = useState(new Set([props.initialLanguage]));
    const [language, setLanguage] = useState(props.initialLanguage);

    const [pending, setPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { toast } = useToast();

    async function submit() {
        setPending(true);

        const res = await fetch('http://localhost:8000/submit', {
            method: 'POST',
            body: JSON.stringify({
                body: code,
                chall: props.id,
                languages: [...submitLanguages]
            } satisfies SubmitPayload),
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include'
        });
        const data = await res.json();

        setPending(false);

        if (!res.ok)
            return setError(data.msg);

        setError(null);
        toast({ success: true, title: `Successfully submitted to ${props.name}`, description: 'Your submission will be scored soon.' })
    }

    function setSubmitLanguage(l: string, b: boolean) {
        setSubmitLanguages((s) => {
            if (b) s.add(l);
            else s.delete(l);
            return new Set(s);
        });
    }

    return (
        <>
            <LanguageSelector
                languages={props.languages}
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
                {code.length} characters ({language})
            </p>

            <div className="mt-1 grid grid-cols-5 text-sm text-primary select-none"> {/* TODO */}
                {props.languages.toSorted().map((l) => (
                    <div className="flex gap-1" key={l}>
                        <input
                            id={l}
                            type="checkbox"
                            checked={submitLanguages.has(l)}
                            onChange={(e) => setSubmitLanguage(l, e.target.checked)}
                        />
                        <label htmlFor={l}>{l}</label>
                    </div>
                ))}
            </div>

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
        </>
    )
}
