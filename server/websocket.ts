import { Submission, Status } from '@/generated/prisma/client';
import { prisma } from '@/util/prisma';
import { UpdateSubmissionMessage, listenersFor } from '@/server/submit';


const ws = new WebSocket('ws://localhost:5000');
ws.onmessage = handleRunnerMessage.bind(null, 'poly');

export function submitPayloadToRunner(chall: string, team: string, submission: Submission) {
    // TODO: ws map by chall
    ws.send(JSON.stringify({
        id: submission.id,
        payload: submission.body,
        team,
    } satisfies RunnerRequest));
}

async function handleRunnerMessage(chall: string, e: MessageEvent) {
    const msg = JSON.parse(e.data) as RunnerResponse;

    switch (msg.type) {
        case 'queue':
            break; // TODO?

        case 'test':
            const s1 = await prisma.submission.update({
                where: { id: msg.id },
                data: { status: Status.TESTING }
            });
            listenersFor(chall).get(msg.team)?.forEach((c) => {
                c.send({ data: { type: 'update', submission: s1 } satisfies UpdateSubmissionMessage })
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
            listenersFor(chall).get(msg.team)?.forEach((c) => {
                c.send({ data: { type: 'update', submission: s2 } satisfies UpdateSubmissionMessage })
            });
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
