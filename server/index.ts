import Fastify from 'fastify';

const app = Fastify({
    logger: true
});

app.get('/', async (req, res) => {
    console.log('hi');
    return { ok: true };
})

void app.listen({ port: 3000 })
