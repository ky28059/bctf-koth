import type { FastifyInstance } from '@/server/index';
import type { SSEReplyInterface } from '@fastify/sse';
import { Status, Submission } from '@/generated/prisma/client';
import { Type } from '@sinclair/typebox';

// Utils
import { prisma } from '@/util/prisma';
import { getMyProfile } from '@/util/profile';
import { challSchema } from '@/server/submit';
import { AUTH_COOKIE_NAME } from '@/util/config';
import { ChallengeId, challenges } from '@/util/challenges';


const scores: Record<string, { name: string, scores: UserScores }> = {};

export const listeners = Object.fromEntries(challenges.map((c) => [c.id, new Set<SSEReplyInterface>()]));

export async function initScoreboard() {
    const users = await prisma.user.findMany();
    for (const user of users) {
        if (!user.top) continue;
        scores[user.id] = {
            name: user.name,
            // @ts-ignore
            scores: Object.fromEntries(challenges.map((c) => [c.id, user.top[c.id] ?? 0]))
        };
    }
    console.log(scores);
}

export default function routes(fastify: FastifyInstance) {
    fastify.get('/sse/scoreboard/:chall', {
        sse: true,
        schema: { params: Type.Object({ chall: challSchema }) }
    }, async (req, res) => {
        const chall = req.params.chall;

        // const token = req.cookies[AUTH_COOKIE_NAME]; // TODO
        // if (!token)
        //     return res.code(401).send({ msg: 'Missing auth token' });
        //
        // const profile = await getMyProfile(token);
        // if (profile.kind !== 'goodUserData')
        //     return res.code(401).send({ msg: 'Invalid auth token' });

        res.sse.keepAlive();

        const entries = Object.entries(scores).map(([id, e]) => ({ name: e.name, id, score: e.scores[chall] }));
        await res.sse.send({
            data: { type: 'all', entries } satisfies AllEntriesMessage
        });

        listeners[chall].add(res.sse);
        res.sse.onClose(() => listeners[chall].delete(res.sse));
    })
}

type UserScores = { [key in ChallengeId]: [number, number] };
type ScoreboardEntry = { name: string, id: string, score: [number, number] };

export type ScoreboardMessage = AllEntriesMessage | NewEntryMessage | UpdateEntryMessage;

export type AllEntriesMessage = {
    type: 'all',
    entries: ScoreboardEntry[]
}

export type NewEntryMessage = {
    type: 'new',
    entry: ScoreboardEntry
}

export type UpdateEntryMessage = {
    type: 'update',
    entry: ScoreboardEntry
}
