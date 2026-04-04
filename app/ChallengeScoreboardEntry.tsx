import { suffix } from '@/util/strings';


type ChallengeScoreboardEntryProps = {
    rank: number,
    avatarUrl: string,
    name: string,
    score: number,
}

export default function ChallengeScoreboardEntry(props: ChallengeScoreboardEntryProps) {
    return (
        <a className="flex gap-2 items-center px-4 py-0.5 hover:bg-white/10 transition duration-100">
            <p className="text-primary text-sm w-8 text-right pr-0.5">
                {props.rank}
                <sup>{suffix(props.rank)}</sup>
            </p>
            <img
                className="size-8 rounded-full"
                src={props.avatarUrl}
                alt={`${props.name} avatar`}
            />
            <p>{props.name}</p>
            <p className="ml-auto text-primary">
                {props.score}
            </p>
        </a>
    )
}
