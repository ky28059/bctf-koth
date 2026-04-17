'use client'

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';
import { Dialog } from 'radix-ui';

// Components
import CenteredModal from '@/components/CenteredModal';
import CopyCodeBlock from '@/components/CopyCodeBlock';
import SubmissionStatusIndicator from '@/app/challenges/SubmissionStatusIndicator';
import SubmissionDownloadLink from '@/app/challenges/SubmissionDownloadLink';

// Utils
import type { SerializedSubmission, SubmissionMessage } from '@/server/submit';
import { BACKEND_URL } from '@/util/config';


type PreviousSubmissionsTableProps = {
    id: string,
    type: 'polyglot' | 'special'
}

export default function PreviousSubmissionsTable(props: PreviousSubmissionsTableProps) {
    const [submissions, setSubmissions] = useState<SerializedSubmission[]>([]);
    const [current, setCurrent] = useState(0);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const events = new EventSource(`${BACKEND_URL}/sse/submissions/${props.id}`, {
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
    }, []);

    function openModalToSubmission(i: number) {
        setCurrent(i);
        setOpen(true);
    }

    return (
        <>
            <div className="table w-full border border-tertiary text-sm rounded-lg overflow-hidden">
                <div className="table-header-group">
                    <div className="table-row text-primary text-sm [&>*]:border-b [&>*]:border-tertiary/50">
                        <div className="table-cell px-2 w-10 text-right">#</div>
                        <div className="table-cell py-1 px-2 w-48 text-left font-semibold">Submission ID</div>
                        <div className="table-cell px-2 w-24 text-left font-semibold">Length</div>
                        <div className="table-cell px-2 w-20 text-left font-semibold">Status</div>
                        <div className="table-cell px-2 w-36 text-left font-semibold">Score</div>
                        <div className="table-cell px-2 text-left font-semibold">Time</div>
                    </div>
                </div>
                <div className="table-row-group bg-black/30">
                    {submissions.toReversed().map((s, i) => (
                        <div key={s.id} className="table-row">
                            <div className="table-cell text-secondary text-right px-2">
                                {submissions.length - i}
                            </div>
                            <div className="table-cell px-2 py-1">
                                <button
                                    // href={`/submission/${s.id}`}
                                    className="cursor-pointer text-blue-400 hover:underline line-clamp-1 text-left"
                                    onClick={() => openModalToSubmission(submissions.length - i - 1)}
                                >
                                    {s.id}
                                </button>
                            </div>
                            <div className="table-cell px-2">{atob(s.body).length}</div>
                            <div className="table-cell px-2">
                                <SubmissionStatusIndicator status={s.status} error={s.error} />
                            </div>
                            <div className="table-cell px-2">
                                {s.score[0] ? Math.abs(s.score[0]) : '-'}
                                {s.score.length > 1 && s.score[1] !== 0 && (
                                    <span className="text-secondary ml-1">({s.score[1]})</span>
                                )}
                            </div>
                            <div className="table-cell px-2 text-primary">
                                {DateTime.fromISO(s.ts).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <CenteredModal
                className="bg-midnight shadow-2xl max-w-3xl max-h-[80%] overflow-y-auto rounded-lg px-8 py-6"
                open={open}
                setOpen={setOpen}
            >
                <Dialog.Title className="text-xl font-bold mb-2">
                    Submission{' '}
                    <a href={`/submission/${submissions[current]?.id}`} className="text-blue-400 hover:underline">
                        {submissions[current]?.id}
                    </a>
                </Dialog.Title>
                {props.type === 'polyglot' ? (
                    <CopyCodeBlock language={submissions[current]?.languages[0]}>
                        {submissions[current]?.body && atob(submissions[current].body)}
                    </CopyCodeBlock>
                ) : (
                    <SubmissionDownloadLink
                        id={submissions[current]?.id}
                        body={submissions[current]?.body}
                    />
                )}
                <div className="text-xs text-secondary mt-1 mb-2">
                    #{current + 1},{' '}
                    {submissions[current]?.languages.length > 0 && (
                        <>languages: [<span className="text-primary">{submissions[current].languages.join(', ')}</span>], </>
                    )}
                    {submissions[current]?.score.length > 0 && (
                        <>score: <span className="text-primary">{Math.abs(submissions[current]?.score[0])}</span> ({submissions[current]?.score[1]}), </>
                    )}
                    time: <span className="text-primary">{submissions[current]?.ts}</span>
                </div>

                {submissions[current]?.error ? (
                    <pre className="mt-2 text-sm overflow-x-auto bg-red-500/20 text-red-500 px-4 py-2 rounded border border-red-500">
                        {submissions[current].error.trim()}
                    </pre>
                ) : ( // TODO?
                    <SubmissionStatusIndicator status={submissions[current]?.status} />
                )}

                {Array.isArray(submissions[current]?.tests) && submissions[current].tests.map((test, i) => (
                    <div className="mt-4" key={i}>
                        <h3 className="text-xs text-primary mb-0.5">
                            Test case {i + 1}
                        </h3>
                        <CopyCodeBlock className="text-sm mb-1">
                            {test[0].trim()}
                        </CopyCodeBlock>
                        <h3 className="text-xs text-primary my-0.5">
                            Checker output:
                        </h3>
                        <CopyCodeBlock className="text-sm">
                            {test[1].trim()}
                        </CopyCodeBlock>
                    </div>
                ))}
            </CenteredModal>
        </>
    )
}
