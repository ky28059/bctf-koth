import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@/generated/prisma/client';

// Utils
import { getScoreboard, LeaderboardEntry } from '@/util/scoreboard';
import { getProfile } from '@/util/profile';
import { SCOREBOARD_PAGE_SIZE } from '@/util/config';
import { writeFile } from 'node:fs/promises';


const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

type ScoreInfo = {
    name: string,
    jeopardy: number,
    koth: Record<string, number>
}

const scores: Record<string, ScoreInfo> = {};
const koth: Record<string, Record<string, [number, number, Date]>> = {};

async function fetchAllScoreboardEntries(ret: LeaderboardEntry[] = [], offset = 0) {
    const res = await getScoreboard(offset);
    if (res.kind !== 'goodLeaderboard') return;
    if (res.data.leaderboard.length === 0) return ret;

    return fetchAllScoreboardEntries(ret.concat(res.data.leaderboard), offset + SCOREBOARD_PAGE_SIZE);
}

;(async () => {
    // Resolve rCTF scores first
    const entries = await fetchAllScoreboardEntries();
    for (const e of entries!) {
        scores[e.id] = {
            name: e.name,
            jeopardy: e.score,
            koth: {}
        }
    }
    console.log(scores);

    // Re-resolve KOTH scores; for each user, associate their ID with their top score for each KOTH chall
    const challs = new Set<string>();
    const submissions = await prisma.submission.findMany();

    for (const s of submissions) {
        if (s.error || s.score.length === 0) continue;
        challs.add(s.challId);

        const score = s.score as [number, number];

        if (!koth[s.userId]) koth[s.userId] = {};
        if (!koth[s.userId][s.challId]) {
            koth[s.userId][s.challId] = [...score, s.ts];
            continue;
        }

        const [old1, old2] = koth[s.userId][s.challId];
        if (old1 > score[0] || (old1 === score[0] && old2 >= score[1])) continue;
        koth[s.userId][s.challId] = [...score, s.ts];
    }

    const leaderboards = [...challs].map((c) => [c, Object.entries(koth)
        .filter(([_, s]) => s[c])
        .map(([k, s]) => [k, s[c]] as const)
        .sort(([k1, s1], [k2, s2]) => s2[0] - s1[0] || s2[1] - s1[1] || s2[2].getTime() - s1[2].getTime())] as const);

    // Now score the KOTHs using the sorted leaderboard
    for (const [chall, leaderboard] of leaderboards) {
        console.log('KOTH', '-', chall);

        for (let i = 0; i < leaderboard.length; i++) {
            const [id] = leaderboard[i];
            const rank = i + 1;

            if (!scores[id]) {
                // If a team didn't play the jeopardy at all, we need to fetch their name from rCTF
                const res = await getProfile(id);
                if (res.kind !== 'goodUserData') throw 'cheese';
                scores[id] = { name: res.data.name, jeopardy: 0, koth: {} };
            }
            scores[id].koth[chall] = 1000 / Math.sqrt(rank);
            console.log(scores[id].name, ':', scores[id].koth[chall], '(', rank, ')');
        }

        console.log();
    }

    const final = Object.entries(scores)
        .map(([id, s]) => ({ ...s, id, total: s.jeopardy + Object.values(s.koth).reduce((a, b) => a + b, 0) }))
        .sort((a, b) => b.total - a.total);

    console.log(final);

    await writeFile('./scoreboard.json', JSON.stringify({
        standings: final.map((s, i) => ({ pos: i + 1, team: s.name, score: Math.round(s.total) }))
    }, null, 2));

    for (let i = 0; i < final.length; i++) {
        const entry = final[i];
        const koth = Object.entries(entry.koth)
            .map(([k, s]) => ` + ${s.toFixed(2)} (${k})`)
            .join('');

        console.log(`${i + 1}. ${entry.name}: ${Math.round(entry.total)} [${entry.jeopardy} (jeopardy)${koth}]`);
    }
})();
