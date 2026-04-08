import { Tabs } from 'radix-ui';
import ChallengeInterface from '@/app/challenges/ChallengeInterface';
import { challenges } from '@/util/challenges';


export default function ChallengesContent() {
    return (
        <Tabs.Root defaultValue={challenges[0].id}>
            <Tabs.List className="mb-10 flex flex-wrap gap-2">
                {challenges.map((c) => (
                    <Tabs.Trigger
                        className="cursor-pointer rounded border px-2 py-1 data-[state=inactive]:opacity-50 data-[state=inactive]:hover:opacity-100 transition duration-200"
                        value={c.id}
                        key={c.id}
                    >
                        {c.name}
                    </Tabs.Trigger>
                ))}
            </Tabs.List>


            {challenges.map((c) => (
                <ChallengeInterface
                    {...c}
                    key={c.id}
                />
            ))}
        </Tabs.Root>
    )
}
