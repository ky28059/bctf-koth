import Fastify from 'fastify';
import fastifyCookie from '@fastify/cookie';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import submit from './submit';


const fastify = Fastify({
    logger: true
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.register(fastifyCookie);

export type FastifyInstance = typeof fastify;

// Routes
fastify.register(submit);

fastify.get('/', async (req, res) => {
    console.log('hi');
    return { ok: true };
})

void fastify.listen({ port: 8000 })
