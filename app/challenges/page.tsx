import { Tabs } from 'radix-ui';
import ChallengeInterface from './ChallengeInterface';
import { challenges } from '@/util/challenges';


export default function Challenges() {
    return (
        <div className="container pt-16">
            <Tabs.Root defaultValue={challenges[0].id}>
                <Tabs.List className="mb-10 flex flex-wrap border-b border-tertiary">
                    {challenges.map((c) => (
                        <Tabs.Trigger
                            className="-mb-px cursor-pointer rounded-t data-[state=active]:bg-midnight data-[state=active]:border border-x-tertiary border-t-tertiary border-b-transparent px-4 py-1.5 data-[state=inactive]:opacity-50 data-[state=inactive]:hover:opacity-100 transition duration-200 focus:outline-none"
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
        </div>
    );
}
