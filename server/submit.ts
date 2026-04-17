import type { FastifyInstance } from '@/server/index';
import type { SSEReplyInterface } from '@fastify/sse';
import zlib from 'node:zlib';
import { promisify } from 'node:util';
import { Status, Submission } from '@/generated/prisma/client';
import { Static, Type } from '@sinclair/typebox';

// Utils
import { prisma } from '@/util/prisma';
import { getMyProfile } from '@/util/profile';
import { submitPayloadToRunner } from '@/server/runners';
import { AUTH_COOKIE_NAME } from '@/util/config';
import { challenges } from '@/util/challenges';
import { names } from '@/server/names';

const zstdCompress = promisify(zlib.zstdCompress);


export const challSchema = Type.Union([
    Type.Literal('poly'), // TODO: autogen?
    Type.Literal('pickle'),
    Type.Literal('bf'),
]);
const submitSchema = Type.Object({
    body: Type.String(),
    chall: challSchema,
    languages: Type.Optional(Type.Array(Type.String()))
});

export type SubmitPayload = Static<typeof submitSchema>;

export const listeners = Object.fromEntries(challenges.map((c) => [c.id, new Map<string, Set<SSEReplyInterface>>()]));
export const rateLimit = new Map<string, Record<string, Set<string>>>();

export default function routes(fastify: FastifyInstance) {
    fastify.post('/submit', { schema: { body: submitSchema } }, async (req, res) => {
        const { body, chall, languages } = req.body;

        const challData = challenges.find(c => c.id === chall)!;
        if (challData.type === 'polyglot' && (!languages || languages.length < 1))
            return res.code(400).send({ msg: 'Code challenge needs non-empty `languages` field' });

        // TODO: better way of doing this?
        try {
            atob(body);
        } catch {
            return res.code(400).send({ msg: 'Body needs to be b64 encoded' });
        }

        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token)
            return res.code(401).send({ msg: 'Missing auth token' });

        const profile = await getMyProfile(token);
        if (profile.kind !== 'goodUserData')
            return res.code(401).send({ msg: 'Invalid auth token' });

        // Hackily rate-limit by team
        if (!rateLimit.has(profile.data.id))
            rateLimit.set(profile.data.id, Object.fromEntries(challenges.map(c => [c.id, new Set()])));

        const inflight = rateLimit.get(profile.data.id)![chall];
        if (inflight.size > 0)
            return res.code(400).send({ msg: 'You are submitting too fast!' });

        // `zstd` compress all special challenge payloads
        const encoded = challData.type === 'special'
            ? (await zstdCompress(Buffer.from(body, 'base64'))).toString('base64') // .toBase64() not supported until node 25
            : body;

        // Store submission in DB, broadcast to all SSE streams
        const submission = await prisma.submission.create({
            data: {
                user: {
                    connectOrCreate: {
                        where: { id: profile.data.id },
                        create: { id: profile.data.id, name: profile.data.name }
                    }
                },
                challId: chall,
                // chall: { connect: { id: chall } },
                status: Status.QUEUED,
                body: encoded,
                languages
            }
        });
        inflight.add(submission.id);
        listeners[chall].get(profile.data.id)?.forEach((c) => {
            c.send({ data: { type: 'new', submission: serialize(submission) } satisfies NewSubmissionMessage })
        });

        submitPayloadToRunner(chall, profile.data.id, submission);

        return { msg: 'Submitted successfully' };
    });

    fastify.get('/sse/submissions/:chall', {
        sse: true,
        schema: { params: Type.Object({ chall: challSchema }) }
    }, async (req, res) => {
        const chall = req.params.chall;

        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token)
            return res.code(401).send({ msg: 'Missing auth token' });

        const profile = await getMyProfile(token);
        if (profile.kind !== 'goodUserData')
            return res.code(401).send({ msg: 'Invalid auth token' });

        // Make sure name mapping is up to date
        names[profile.data.id] = profile.data.name;

        res.sse.keepAlive();

        const submissions = await prisma.submission.findMany({
            where: {
                userId: profile.data.id,
                challId: chall
            }
        });
        await res.sse.send({
            data: { type: 'all', submissions: submissions.map(serialize) } satisfies AllSubmissionsMessage
        });

        const s = listeners[chall].get(profile.data.id); // TODO: clean up
        if (s) {
            s.add(res.sse);
        } else {
            listeners[chall].set(profile.data.id, new Set([res.sse]));
        }
        res.sse.onClose(() => listeners[chall].get(profile.data.id)!.delete(res.sse));
    })
}

// TODO: replace with type assertion?
export function serialize(s: Submission): SerializedSubmission {
    return {
        ...s,
        tests: s.tests as [string, string][] | null,
        ts: s.ts.toISOString()
    }
}

export type SubmissionMessage = AllSubmissionsMessage | NewSubmissionMessage | UpdateSubmissionMessage;

export type SerializedSubmission = {
    body: string
    id: string
    status: Status
    score: number[]
    languages: string[]
    error: string | null
    tests: [string, string][] | null
    ts: string
    challId: string
    userId: string
}

export type AllSubmissionsMessage = {
    type: 'all',
    submissions: SerializedSubmission[]
}

export type NewSubmissionMessage = {
    type: 'new',
    submission: SerializedSubmission
}

export type UpdateSubmissionMessage = {
    type: 'update',
    submission: SerializedSubmission
}
