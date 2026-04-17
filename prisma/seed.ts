import 'dotenv/config';

import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { challenges } from '@/util/challenges';


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// export async function main() {
//     for (const c of challenges) {
//         await prisma.challenge.create({ data: { id: c.id } });
//     }
// }

// void main();
