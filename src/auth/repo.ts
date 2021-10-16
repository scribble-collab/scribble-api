import db from '../db';

const sessionTable = 'session';

export const saveSession = async (sessionId) => {
    return await db(sessionTable).insert({ sessionId: sessionId });
}

export const getSessionById = async (sessionId) => {
    return db(sessionTable).select('*').where({ sessionId }).first();
}

export const deleteSession = async (sessionId: string) => {
    return db(sessionTable).delete().where({ sessionId: sessionId });
}
