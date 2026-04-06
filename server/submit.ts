import type { FastifyInstance } from '@/server/index';
import { Type } from '@sinclair/typebox';
import { prisma } from '@/util/prisma';


export default function routes(fastify: FastifyInstance) {
    fastify.post('/submit', {
        schema: {
            body: Type.Object({
                body: Type.String(),
                chall: Type.Union([
                    Type.Literal('poly'), // TODO: autogen?
                    Type.Literal('pickle'),
                    Type.Literal('shell'),
                ])
            })
        }
    }, async (req, res) => {
        const { body, chall } = req.body;

        const cookie = req.cookies['ctf_clearance'];
        if (!cookie)
            return res.code(401).send({ ok: false });

        console.log(await prisma.user.findMany());

        return { ok: true }
    });
}
