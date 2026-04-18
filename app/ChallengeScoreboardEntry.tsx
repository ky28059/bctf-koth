import { suffix } from '@/util/strings';
import { CTF_URL } from '@/util/config';


type ChallengeScoreboardEntryProps = {
    rank: number,
    name: string,
    id: string,
    score: [number, number],
}

export default function ChallengeScoreboardEntry(props: ChallengeScoreboardEntryProps) {
    return (
        <a
            className="flex gap-3 items-center px-4 py-0.5 hover:bg-white/10 transition duration-100"
            href={`${CTF_URL}/profile/${props.id}`}
            target="_blank"
        >
            <p className="text-primary text-sm w-8 flex-none text-right pr-0.5">
                {props.rank}
                <sup>{suffix(props.rank)}</sup>
            </p>
            <p className="text-sm py-0.5 line-clamp-1">{props.name}</p>
            <p className="ml-auto text-primary text-sm">
                {Math.abs(props.score[0])}
                {props.score[1] !== 0 && (
                    <span className="text-secondary ml-1">({props.score[1]})</span>
                )}
            </p>
        </a>
    )
}
