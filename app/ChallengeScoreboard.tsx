import ChallengeScoreboardEntry from '@/app/ChallengeScoreboardEntry';


export default function ChallengeScoreboard(props: { className?: string }) {
    return (
        <aside className={'flex flex-col' + (props.className ? ` ${props.className}` : '')}>
            {Array(100).fill(0).map((_, i) => (
                <ChallengeScoreboardEntry
                    rank={i + 1}
                    name="b01lers"
                    score={[15, -270]}
                    key={i}
                />
            ))}
        </aside>
    )
}
