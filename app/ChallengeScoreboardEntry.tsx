import { suffix } from '@/util/strings';


type ChallengeScoreboardEntryProps = {
    rank: number,
    name: string,
    score: [number, number],
}

export default function ChallengeScoreboardEntry(props: ChallengeScoreboardEntryProps) {
    return (
        <a className="flex gap-3 items-center px-4 py-0.5 hover:bg-white/10 transition duration-100">
            <p className="text-primary text-sm w-8 text-right pr-0.5">
                {props.rank}
                <sup>{suffix(props.rank)}</sup>
            </p>
            <p>{props.name}</p>
            <p className="ml-auto text-primary">
                {props.score[0]} <span className="text-secondary">({props.score[1]})</span>
            </p>
        </a>
    )
}
