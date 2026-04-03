import ChallengeScoreboardEntry from '@/app/challenges/ChallengeScoreboardEntry';

export default function ChallengeInterface() {
    return (
        <div className="flex gap-8">
            <div>
                <h1 className="text-3xl font-bold mb-4">
                    Polyglot
                </h1>
                <p>
                    Write a polyglot that compiles / runs in as many of the following languages as possible:
                    [...]. In each language, your code should read 3 values a, b, and c from `stdin` then output `a^b%c` to
                    `stdout`. [...]
                </p>
            </div>

            <aside className="border-l border-tertiary flex-none">
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
        </div>
    )
}
