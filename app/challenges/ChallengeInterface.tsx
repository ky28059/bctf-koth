import { Tabs } from 'radix-ui';

// Components
import PreviousSubmissionsTable from '@/app/challenges/PreviousSubmissionsTable';
import ChallengeScoreboard from '@/app/ChallengeScoreboard';
import PolyglotChallengeInterface from '@/app/challenges/PolyglotChallengeInterface';
import SpecialChallengeInterface from '@/app/challenges/SpecialChallengeInterface';
import StyledMarkdown from '@/components/StyledMarkdown';

// Utils
import type { ChallengeData } from '@/util/challenges';


export default function ChallengeInterface(props: ChallengeData) {
    return (
        <Tabs.Content value={props.id} forceMount className="flex gap-8 data-[state=inactive]:hidden">
            <div className="pb-20 flex-grow min-w-0">
                <h1 className="text-3xl font-bold mb-4">
                    {props.name}
                </h1>
                <StyledMarkdown className="text-sm">
                    {props.description}
                </StyledMarkdown>

                {props.type === 'polyglot' ? (
                    <PolyglotChallengeInterface {...props} />
                ) : (
                    <SpecialChallengeInterface {...props} />
                )}

                <h2 className="font-bold text-xl mt-12 mb-3">
                    Previous submissions
                </h2>
                <PreviousSubmissionsTable id={props.id} />
            </div>

            <ChallengeScoreboard className="w-64 border-l border-tertiary flex-none max-h-screen overflow-y-auto sticky top-0" />
        </Tabs.Content>
    )
}
