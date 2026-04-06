import type { FastifyInstance } from '@/server/index';
import { Static, Type } from '@sinclair/typebox';

// Utils
import { prisma } from '@/util/prisma';
import { getMyProfile } from '@/util/profile';


const submitSchema = Type.Object({
    body: Type.String(),
    chall: Type.Union([
        Type.Literal('poly'), // TODO: autogen?
        Type.Literal('pickle'),
        Type.Literal('shell'),
    ])
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
        await prisma.submission.create({
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

        return { msg: 'Submitted successfully' };
    });
}
