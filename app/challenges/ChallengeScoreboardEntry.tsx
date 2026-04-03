type ChallengeScoreboardEntryProps = {
    rank: number,
    avatarUrl: string,
    name: string,
    score: number,
}

export default function ChallengeScoreboardEntry(props: ChallengeScoreboardEntryProps) {
    return (
        <a className="flex gap-2 items-center pl-4 py-0.5 hover:bg-white/10 transition duration-100">
            <p className="text-primary text-sm w-9">{props.rank}st</p>
            <img
                className="size-10 rounded-full"
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
