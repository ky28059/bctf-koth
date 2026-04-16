'use server'

import type { BadTokenResponse, UserNotFoundResponse } from '@/util/errors';


export type ProfileData = {
    name: string,
    ctftimeId: null,
    division: string,
    score: number,
    globalPlace: number | null,
    divisionPlace: number | null,
    solves: Solve[]
}

export type MyProfileData = ProfileData & {
    teamToken: string,
    allowedDivisions: string[],
    id: string,
    email: string
}

export type Solve = {
    category: string,
    name: string,
    points: number,
    solves: number,
    id: string,
    createdAt: number // epoch ms
}

type ProfileResponse<T extends ProfileData> = {
    kind: 'goodUserData',
    message: string,
    data: T
}

export async function getMyProfile(token: string): Promise<ProfileResponse<MyProfileData> | BadTokenResponse> {
    const res = await fetch(`${process.env.API_BASE}/users/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return res.json();
}
