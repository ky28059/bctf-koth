import type { FastifyInstance } from '@/server/index';
import type { SSEReplyInterface } from '@fastify/sse';
import { Status, Submission } from '@/generated/prisma/client';
import { Static, Type } from '@sinclair/typebox';

// Utils
import { prisma } from '@/util/prisma';
import { getMyProfile } from '@/util/profile';
import { submitPayloadToRunner } from '@/server/websocket';
import { AUTH_COOKIE_NAME } from '@/util/config';
import { challenges } from '@/util/challenges';


const challSchema = Type.Union([
    Type.Literal('poly'), // TODO: autogen?
    Type.Literal('pickle'),
    Type.Literal('bf'),
    Type.Literal('compcov'),
]);
const submitSchema = Type.Object({
    body: Type.String(),
    chall: challSchema,
    languages: Type.Optional(Type.Array(Type.String()))
});

export type SubmitPayload = Static<typeof submitSchema>;

export const listeners: Record<string, Map<string, Set<SSEReplyInterface>>> = {};
challenges.forEach((c) => listeners[c.id] = new Map());

export default function routes(fastify: FastifyInstance) {
    fastify.post('/submit', { schema: { body: submitSchema } }, async (req, res) => {
        const { body, chall, languages } = req.body;

        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token)
            return res.code(401).send({ msg: 'Missing auth token' });

        const profile = await getMyProfile(token);
        if (profile.kind !== 'goodUserData')
            return res.code(401).send({ msg: 'Invalid auth token' });

        // Store submission in DB, broadcast to all SSE streams
        const submission = await prisma.submission.create({
            data: {
                user: {
                    connectOrCreate: {
                        where: { id: profile.data.id },
                        create: { id: profile.data.id }
                    }
                },
                chall: { connect: { id: chall } },
                status: Status.QUEUED,
                body: btoa(body),
                languages
            }
        });
        listeners[chall].get(profile.data.id)?.forEach((c) => {
            c.send({ data: { type: 'new', submission } satisfies NewSubmissionMessage })
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

        res.sse.keepAlive();

        const submissions = await prisma.submission.findMany({
            where: {
                userId: profile.data.id,
                challId: chall
            }
        });
        await res.sse.send({
            data: { type: 'all', submissions } satisfies AllSubmissionsMessage
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

export type SubmissionMessage = AllSubmissionsMessage | NewSubmissionMessage | UpdateSubmissionMessage;

export type AllSubmissionsMessage = {
    type: 'all',
    submissions: Submission[]
}

export type NewSubmissionMessage = {
    type: 'new',
    submission: Submission
}

export type UpdateSubmissionMessage = {
    type: 'update',
    submission: Submission
}
