import type { FastifyInstance } from '@/server/index';
import type { SSEReplyInterface } from '@fastify/sse';
import { Type } from '@sinclair/typebox';

// Utils
import { prisma } from '@/util/prisma';
import { challSchema } from '@/server/submit';
import { ChallengeId, challenges } from '@/util/challenges';
import { names } from '@/server/names';


const scoreboard: Record<string, UserScores> = {};

export const listeners = Object.fromEntries(challenges.map((c) => [c.id, new Set<SSEReplyInterface>()]));

export async function initScoreboard() {
    const users = await prisma.user.findMany();
    for (const user of users) {
        names[user.id] = user.name;
        // @ts-ignore
        scoreboard[user.id] = Object.fromEntries(challenges.map((c) => [c.id, user.top?.[c.id]]))
    }
}

export async function updateUserScore(id: string, chall: ChallengeId, score: [number, number]) {
    if (!scoreboard[id]) {
        // @ts-ignore
        scoreboard[id] = Object.fromEntries(challenges.map((c) => [c.id, c.id === chall ? score : null]));
        listeners[chall].forEach((c) => {
            c.send({ data: { type: 'new', entry: { name: names[id], id, score } } satisfies NewEntryMessage })
        });
    } else {
        const old = scoreboard[id][chall];
        if (old && (old[0] > score[0] || (old[0] === score[0] && old[1] >= score[1]))) return;

        scoreboard[id][chall] = score;
        listeners[chall].forEach((c) => {
            c.send({ data: { type: 'update', entry: { name: names[id], id, score } } satisfies UpdateEntryMessage })
        });
    }

    await prisma.user.update({
        where: { id },
        data: { top: scoreboard[id] }
    });
}

export default function routes(fastify: FastifyInstance) {
    fastify.get('/sse/scoreboard/:chall', {
        sse: true,
        schema: { params: Type.Object({ chall: challSchema }) }
    }, async (req, res) => {
        const chall = req.params.chall;

        res.sse.keepAlive();

        const entries = Object.entries(scoreboard)
            .filter(([_, scores]) => scores[chall])
            .map(([id, scores]) => ({ name: names[id], id, score: scores[chall]! }));

        await res.sse.send({
            data: { type: 'all', entries } satisfies AllEntriesMessage
        });

        listeners[chall].add(res.sse);
        res.sse.onClose(() => listeners[chall].delete(res.sse));
    })
}

type UserScores = { [key in ChallengeId]: [number, number] | null };
export type ScoreboardEntry = { name: string, id: string, score: [number, number] };

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
