import type { Status } from '@/generated/prisma/enums';


export default function SubmissionStatusIndicator(props: { status: Status, error?: string }) {
    return props.status === 'QUEUED' ? (
        <span className="bg-amber-500/20 text-amber-500 rounded-full text-xs px-1.5 py-0.5">
            In queue
        </span>
    ) : props.status === 'TESTING' ? (
        <span className="bg-yellow-500/20 text-yellow-500 rounded-full text-xs px-1.5 py-0.5">
            Testing
        </span>
    ) : props.error ? (
        <span className="bg-red-500/20 text-red-500 rounded-full text-xs px-1.5 py-0.5">
            Error
        </span>
    ) : (
        <span className="bg-lime-500/20 text-lime-500 rounded-full text-xs px-1.5 py-0.5">
            Scored
        </span>
    );
}
