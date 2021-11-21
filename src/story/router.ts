import * as hapi from '@hapi/hapi';
import { isLeft } from 'fp-ts/lib/Either';
import {
    CommentSchema,
    LikeSchema,
    StoryCreationSchema,
    StorySearchSchema
} from './types';
import { wrap } from './utils';


export default function (server: hapi.Server, handler) {
    server.route({
        method: 'POST',
        path: '/story/create',
        options: {
            handler: async (request, h) => {
                const response = await handler.createStory({
                    ...request.payload,
                    author: request.auth.credentials.userId
                });
                if (isLeft(response)) {
                    const formatted = wrap(response.left);
                    return h.response(formatted).code(formatted.status);
                }
                const formatted = wrap(response.right);
                return h.response(formatted).code(formatted.status);
            },
            auth: {
                scope: ['admin', 'user']
            },
            validate: {
                payload: StoryCreationSchema,
            },
            tags: ['api', 'story'],
            description: 'story creation api',
            notes: 'creates new story and returns status for response no data',
        },
    });

    server.route({
        method: 'GET',
        path: '/story',
        options: {
            handler: async (request, h) => {
                const response = await handler.searchStories(request.query);
                return h.response(response).code(200);
            },
            auth: {
                scope: ['admin', 'user']
            },
            validate: {
                query: StorySearchSchema
            },
            tags: ['api', 'story'],
            description: 'read all original stories',
            notes: 'retrieve all stories ',
        },
    });

    server.route({
        method: 'PUT',
        path: '/story/like',
        options: {
            handler: async (request, h) => {
                const response = await handler.likeStory({
                    story: request.payload.story,
                    userId: request.auth.credentials.userId
                });
                if (isLeft(response)) {
                    const formatted = wrap(response.left);
                    return h.response(formatted).code(formatted.status);
                }
                const formatted = wrap(response.right);
                return h.response(formatted).code(formatted.status);
            },
            auth: {
                scope: ['admin', 'user']
            },
            validate: {
                payload: LikeSchema,
            },
            tags: ['api', 'story'],
            description: 'story liking api',
            notes: 'creates new like for the story',
        },
    });

    server.route({
        method: 'PUT',
        path: '/story/comment',
        options: {
            handler: async (request, h) => {
                const response = await handler.commentStory({
                    ...request.payload,
                    userId: request.auth.credentials.userId
                });
                if (isLeft(response)) {
                    const formatted = wrap(response.left);
                    return h.response(formatted).code(formatted.status);
                }
                const formatted = wrap(response.right);
                return h.response(formatted).code(formatted.status);
            },
            auth: {
                scope: ['admin', 'user']
            },
            validate: {
                payload: CommentSchema,
            },
            tags: ['api', 'story'],
            description: 'story commenting api',
            notes: 'creates new comment for the story',
        },
    });
}