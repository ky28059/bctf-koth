import Fastify from 'fastify';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import fastifyCookie from '@fastify/cookie';
import fastifyCors from '@fastify/cors';

// Routes
import submit from './submit';


const fastify = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyCookie);
fastify.register(fastifyCors);

export type FastifyInstance = typeof fastify;

// Routes
fastify.register(submit);

fastify.get('/', async (req, res) => {
    console.log('hi');
    return { ok: true };
})

void fastify.listen({ port: 8000 })
