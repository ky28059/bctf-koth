import { Tabs } from 'radix-ui';

// Components
import PreviousSubmissionsTable from '@/app/challenges/PreviousSubmissionsTable';
import ChallengeScoreboard from '@/app/ChallengeScoreboard';
import PolyglotChallengeInterface from '@/app/challenges/PolyglotChallengeInterface';
import SpecialChallengeInterface from '@/app/challenges/SpecialChallengeInterface';
import StyledMarkdown from '@/components/StyledMarkdown';

// Utils
import type { ChallengeData } from '@/util/challenges';

// Icons
import { FaDownload } from 'react-icons/fa6';


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
                <p className="text-xs text-primary">
                    Author: {props.author}
                </p>

                {props.files && props.files.length > 0 && (
                    <div className="flex gap-2 mt-2">
                        {props.files.map((file, i) => (
                            <a
                                className="bg-white/10 hover:bg-white/15 transition duration-200 px-5 py-3 rounded-sm text-sm text-primary font-semibold flex gap-2 items-center"
                                href={`/handouts/${file}`}
                                download={file}
                                key={file + i}
                            >
                                <FaDownload />
                                {file}
                            </a>
                        ))}
                    </div>
                )}

                {props.type === 'polyglot' ? (
                    <PolyglotChallengeInterface {...props} />
                ) : (
                    <SpecialChallengeInterface {...props} />
                )}

                <h2 className="font-bold text-xl mt-12 mb-3">
                    Previous submissions
                </h2>
                <PreviousSubmissionsTable id={props.id} type={props.type} />
            </div>

            <ChallengeScoreboard
                className="w-64 border-l border-tertiary flex-none max-h-screen overflow-y-auto sticky top-0"
                id={props.id}
            />
        </Tabs.Content>
    )
}
