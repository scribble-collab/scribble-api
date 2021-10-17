import _ from 'ramda';
import config from '../../src/config';
import knex from '../../src/db';
import { init } from '../../src/server';
import FakeFileStorageBackend from './fakeFileBackend';

let testEnv: undefined | any;

async function resetDB() {
    const query = `
    truncate table users, session, stories, story_tags, tags, likes, comments, followers CASCADE;
    `;
    return knex.schema.raw(query);
}

async function initTestServer() {
    const updateConfig = _.mergeRight(config, {
        SENTRY_DSN: undefined,
    });

    const { server, handlers } = await init(
        updateConfig,
        FakeFileStorageBackend(),
    );

    await knex.migrate.rollback();
    await knex.migrate.latest();

    return {
        server,
        resetDB: resetDB,
        authHandler: handlers.authHandler,
    };
}

export async function getTestEnv() {
    if (testEnv === undefined) {
        testEnv = await initTestServer();
    }
    return testEnv;
}
