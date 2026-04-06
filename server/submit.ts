import type { FastifyInstance } from '@/server/index';
import type { SSEReplyInterface } from '@fastify/sse';
import type { Submission } from '@/generated/prisma/client';
import { Static, Type } from '@sinclair/typebox';

// Utils
import { prisma } from '@/util/prisma';
import { getMyProfile } from '@/util/profile';
import { AUTH_COOKIE_NAME } from '@/util/config';


const challSchema = Type.Union([
    Type.Literal('poly'), // TODO: autogen?
    Type.Literal('pickle'),
    Type.Literal('shell'),
]);
const submitSchema = Type.Object({
    body: Type.String(),
    chall: challSchema,
});

export type SubmitPayload = Static<typeof submitSchema>;

const conn = new Map<string, Set<SSEReplyInterface>>();

export default function routes(fastify: FastifyInstance) {
    fastify.post('/submit', { schema: { body: submitSchema } }, async (req, res) => {
        const { body, chall } = req.body;

        const token = req.cookies[AUTH_COOKIE_NAME];
        if (!token)
            return res.code(401).send({ msg: 'Missing auth token' });

        const profile = await getMyProfile(token);
        if (profile.kind !== 'goodUserData')
            return res.code(401).send({ msg: 'Invalid auth token' });

        // TODO: submit to specific runner

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
                body
            }
        });
        const connections = conn.get(profile.data.id);
        connections?.forEach((c) => {
            c.send({ data: { type: 'new', submission } satisfies NewSubmissionMessage })
        });

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

        const s = conn.get(profile.data.id); // TODO: clean up
        if (s) {
            s.add(res.sse);
        } else {
            conn.set(profile.data.id, new Set([res.sse]));
        }
        res.sse.onClose(() => conn.get(profile.data.id)!.delete(res.sse));
    })
}

export type SubmissionMessage = AllSubmissionsMessage | NewSubmissionMessage;

export type AllSubmissionsMessage = {
    type: 'all',
    submissions: Submission[]
}

export type NewSubmissionMessage = {
    type: 'new',
    submission: Submission
}
