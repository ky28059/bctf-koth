import ChallengeScoreboard from '@/app/ChallengeScoreboard';
import { challenges } from '@/util/challenges';
import Link from 'next/link';


export default function Home() {
    return (
        <div className="flex flex-col">
            <div className="container pt-16 pb-12">
                <h1 className="text-3xl font-bold mb-2">
                    b01lers CTF KOTH dashboard
                </h1>
                <p className="text-sm text-primary">
                    Welcome to the b01lers CTF 2026 KOTH dashboard! Authenticate with your rCTF account, then go to{' '}
                    <Link href="/challenges" className="text-blue-400 hover:underline">/challenges</Link>{' '}
                    to view the king-of-the-hill challenges.
                </p>
            </div>

            <div className="flex max-h-screen divide-x divide-tertiary">
                {challenges.map((c) => (
                    <div key={c.id} className="flex flex-col w-full">
                        <p className="text-center text-secondary font-mono text-sm font-bold mb-1 pt-1">
                            {c.name}
                        </p>
                        <ChallengeScoreboard
                            className="overflow-y-auto"
                            id={c.id}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
