import db from '../db';

const commentTable = 'comments';

export const addComment = async (storyId: string, userId: string, comment: string) => {
    const out = await db(commentTable).insert({ storyId, comment, userId }).returning('id');
    return out[0];
}

export const list = async (storyId: string) => {
    return await db(commentTable).select('*').where({ storyId });
}