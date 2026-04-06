import type { FastifyInstance } from 'fastify';
import { prisma } from '@/util/prisma';


export default function routes(fastify: FastifyInstance) {
    fastify.get('/submit', async (req, res) => {
        console.log(await prisma.user.findMany());

        return { msg: 'hiiii' }
    })
}
