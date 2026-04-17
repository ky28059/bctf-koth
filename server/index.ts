import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';
import fastifySSE from '@fastify/sse';

// Routes
import { initRunnerConnections } from '@/server/runners';
import { initScoreboard } from '@/server/scoreboard';
import submit from './submit';
import scoreboard from './scoreboard';

// Utils
import { FRONTEND_URL } from '@/util/config';


const fastify = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

export type FastifyInstance = typeof fastify;

async function start() {
    await fastify.register(fastifyCookie);
    await fastify.register(fastifyCors, {
        origin: [FRONTEND_URL],
        credentials: true
    });
    await fastify.register(fastifySSE);

    // Routes
    await initRunnerConnections();
    await initScoreboard();
    await fastify.register(submit);
    await fastify.register(scoreboard);

    await fastify.listen({ port: 8000, host: '0.0.0.0' });
}

void start();
