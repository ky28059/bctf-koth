# bctf-koth
King-of-the-hill dashboard for b01lers CTF.

### Development
The dashboard is composed of a Next.js frontend and a fastify backend (for stateful operations like SSE).
Install dependencies with
```bash
npm i
```
and create a `.env` exporting the Postgres database URL like so:
```env
DATABASE_URL="..."
```
Run the server with
```bash
npm run server
```
and the frontend with
```bash
npm run dev
```
For docker deployment, make sure the docker runner network exists first.
```bash
docker network create koth
docker compose up
```

### Managing the database
As a database, this project uses the Prisma ORM on top of Postgres.
<!-- After creating a database, run
```bash
npx prisma db seed
```
to seed it with default values. -->

The database schema is stored in `/prisma/schema.prisma`; use
```bash
npx prisma migrate dev
```
after updating it to create a database migration and
```bash
npx prisma generate
```
to regenerate TypeScript bindings.
