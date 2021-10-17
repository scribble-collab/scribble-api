import db from '../db';
import { Story, Tag } from './types';
import { v4 as uuid } from 'uuid';
import config from '../config';

const tagsTable = 'tags';
const storyTagTable = 'story_tags';
const storyTable = 'stories';


export const saveStory = async (story: Story) => {
    const out = await db(storyTable).insert({
        ...story,
        slug: uuid()
    }).returning('id');
    return out[0];
}

export const saveTags = async (tags: Tag[]) => {
    return await db(tagsTable).insert(tags).onConflict('tag').ignore().returning('id');
}

export const saveStoryTags = async (tagId: string, storyId: string) => {
    await db(storyTagTable).insert({ storyId, tagId });
}

export const getUserStories = async (userId: string) => {
    const query = `
    SELECT
        stories.*,
        ARRAY_AGG(tags.tag) AS tags,
        users.username 
    FROM
        stories 
        LEFT JOIN
            story_tags 
            ON stories.id = story_tags."storyId" 
        LEFT JOIN
            tags 
            ON story_tags."tagId" = tags.id 
        LEFT JOIN
            users 
            ON stories.author = users.id 
    WHERE
        stories.author = :userId
    GROUP BY
        stories.id,
        users.username 
    ORDER BY
        stories."updatedAt" DESC;
    `;
    return await db.raw(query, { userId }).then((r) => r.rows);
}

export const getOriginalStories = async (page: number) => {
    const limit = config.PAGINATION as number;
    const offset = limit * page;

    const query = `
    SELECT
        stories.*,
        ARRAY_AGG(tags.tag) AS tags,
        users.username 
    FROM
        stories 
        LEFT JOIN
            story_tags 
            ON stories.id = story_tags."storyId" 
        LEFT JOIN
            tags 
            ON story_tags."tagId" = tags.id 
        LEFT JOIN
            users 
            ON stories.author = users.id 
    WHERE
        stories.ref IS NULL
    GROUP BY
        stories.id,
        users.username 
    ORDER BY
        stories."updatedAt" DESC
    LIMIT :limit
    OFFSET :offset;
    `;
    return await db.raw(query, { limit, offset }).then((r) => r.rows);
}

export const getVersionStories =  async (page: number, storyId: string) => {
    const limit = config.PAGINATION as number;
    const offset = limit * page;

    const query = `
    SELECT
        stories.*,
        ARRAY_AGG(tags.tag) AS tags,
        users.username 
    FROM
        stories 
        LEFT JOIN
            story_tags 
            ON stories.id = story_tags."storyId" 
        LEFT JOIN
            tags 
            ON story_tags."tagId" = tags.id 
        LEFT JOIN
            users 
            ON stories.author = users.id 
    WHERE
        stories.ref = :storyId
    GROUP BY
        stories.id,
        users.username 
    ORDER BY
        stories."updatedAt" DESC
    LIMIT :limit
    OFFSET :offset;
    `;
    return await db.raw(query, { limit, offset, storyId }).then((r) => r.rows);
}