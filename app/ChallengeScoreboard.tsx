import ChallengeScoreboardEntry from '@/app/ChallengeScoreboardEntry';


export default function ChallengeScoreboard(props: { className?: string }) {
    return (
        <aside className={'flex flex-col' + (props.className ? ` ${props.className}` : '')}>
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
    )
}
