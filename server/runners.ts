import { Submission, Status } from '@/generated/prisma/client';
import { prisma } from '@/util/prisma';

// Utils
import { listeners, serialize, UpdateSubmissionMessage } from '@/server/submit';
import { ChallengeId, challenges } from '@/util/challenges';
import { updateUserScore } from '@/server/scoreboard';


const runners: Record<string, WebSocket> = {};

export async function initRunnerConnections() {
    for (const c of challenges) {
        runners[c.id] = new WebSocket(c.runnerUrl);
        runners[c.id].onmessage = handleRunnerMessage.bind(null, c.id);
    }
}

export function submitPayloadToRunner(chall: string, team: string, submission: Submission) {
    runners[chall].send(JSON.stringify({
        id: submission.id,
        payload: submission.body,
        team,
        languages: submission.languages,
    } satisfies RunnerRequest));
}

async function handleRunnerMessage(chall: ChallengeId, e: MessageEvent) {
    const msg = JSON.parse(e.data) as RunnerResponse;
    console.log(chall, 'received from runner', msg);

    switch (msg.type) {
        case 'queue':
            break; // TODO?

        case 'test':
            const s1 = await prisma.submission.update({
                where: { id: msg.id },
                data: { status: Status.TESTING }
            });
            listeners[chall].get(msg.team)?.forEach((c) => {
                c.send({ data: { type: 'update', submission: serialize(s1) } satisfies UpdateSubmissionMessage })
            });
            break;

        case 'completed':
            const s2 = await prisma.submission.update({
                where: { id: msg.id },
                data: {
                    status: Status.COMPLETED,
                    score: msg.score,
                    tests: msg.tests,
                    error: msg.error
                }
            });
            listeners[chall].get(msg.team)?.forEach((c) => {
                c.send({ data: { type: 'update', submission: serialize(s2) } satisfies UpdateSubmissionMessage })
            });
            await updateUserScore(msg.team, chall, msg.score);
            break;
    }
}

type RunnerRequest = {
    id: string,
    team: string,
    payload: string,
    languages?: string[],
}

type RunnerResponse = QueueResponse | TestResponse | CompletedResponse;

type QueueResponse = {
    type: 'queue',
    id: string,
    team: string,
}

type TestResponse = {
    type: 'test',
    id: string,
    team: string,
}

type CompletedResponse = {
    type: 'completed',
    id: string,
    team: string,
    score: [number, number], // [primary, tiebreak]
    tests: [string, string][], // [test case, output]
    error?: string
}
