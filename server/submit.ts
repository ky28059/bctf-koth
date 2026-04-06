import type { FastifyInstance } from '@/server/index';
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

export default function routes(fastify: FastifyInstance) {
    fastify.post('/submit', { schema: { body: submitSchema } }, async (req, res) => {
        const { body, chall } = req.body;

        const auth = req.headers.authorization;
        if (!auth)
            return res.code(401).send({ msg: 'Missing auth token' });

        const profile = await getMyProfile(decodeURIComponent(auth.split(' ')[1]));
        if (profile.kind !== 'goodUserData')
            return res.code(401).send({ msg: 'Invalid auth token' });

        // TODO: submit to specific runner

        // Store submission in DB
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
        console.log(submission.id);

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

        for (let i = 0; i < submissions.length; i++) {
            await res.sse.send({ data: 'Hello!' })
        }
    })
}
