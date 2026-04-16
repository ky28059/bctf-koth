import Link from 'next/link';
import { notFound } from 'next/navigation';

// Components
import CopyCodeBlock from '@/components/CopyCodeBlock';
import SubmissionStatusIndicator from '@/app/challenges/SubmissionStatusIndicator';

// Utils
import { prisma } from '@/util/prisma';


export default async function Submission({ params }: { params: Promise<{ id: string }> }) {
    const id = (await params).id;
    
    const submission = await prisma.submission.findUnique({ where: { id } });
    if (!submission)
        return notFound();

    return (
        <div className="container pt-8 pb-16">
            <Link href="/challenges" className="text-secondary hover:underline text-sm mb-10 -ml-5 block w-max">
                ← Back to challenges
            </Link>

            <h1 className="text-3xl font-bold mb-3">
                Submission{' '}
                <a href={`/submission/${submission.id}`} className="text-blue-400 hover:underline">
                    {submission.id}
                </a>
            </h1>

            <CopyCodeBlock language={submission.languages[0]}>
                {atob(submission.body)}
            </CopyCodeBlock>
            <div className="text-sm text-secondary mt-1 mb-2">
                {submission.languages.length > 0 && (
                    <>languages: [<span className="text-primary">{submission.languages.join(', ')}</span>], </>
                )}
                {submission.score.length > 0 && (
                    <>score: <span className="text-primary">{submission.score[0]}</span> ({submission.score[1]}), </>
                )}
                time: <span className="text-primary">{submission.ts.toISOString()}</span>
            </div>

            {submission.error ? (
                <pre className="mt-2 text-sm overflow-x-auto bg-red-500/20 text-red-500 px-4 py-2 rounded border border-red-500">
                    {submission.error.trim()}
                </pre>
            ) : ( // TODO?
                <SubmissionStatusIndicator status={submission.status} />
            )}

            {Array.isArray(submission.tests) && submission.tests.map((test, i) => (
                <div className="mt-4" key={i}>
                    <h3 className="text-xs text-primary mb-0.5">
                        Test case {i + 1}
                    </h3>
                    <CopyCodeBlock className="text-sm mb-1">
                        {(test as string[])[0].trim()}
                    </CopyCodeBlock>
                    <h3 className="text-xs text-primary my-0.5">
                        Checker output:
                    </h3>
                    <CopyCodeBlock className="text-sm">
                        {(test as string[])[1].trim()}
                    </CopyCodeBlock>
                </div>
            ))}
        </div>
    );
}
