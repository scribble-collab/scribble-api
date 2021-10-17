import db from '../db';

const likesTable = 'likes';

export const addLike = async (storyId: string, userId: string) => {
    const out = await db(likesTable).insert({ storyId, userId }).returning('id');
    return out[0];
}