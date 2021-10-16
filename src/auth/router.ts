import * as hapi from '@hapi/hapi';
import { isLeft } from 'fp-ts/lib/Either';
import { userLoggedInEvent, userLoggedInFailed } from '../logEvents';
import { LoginSchema, SignUpSchema } from './types';
import { wrap } from './utils';

export default function (server: hapi.Server, authHandler) {
    server.route({
        method: 'POST',
        path: '/auth/login',
        options: {
            handler: async (request, h) => {
                const response = await authHandler.login(request.payload,);
                if (isLeft(response)) {
                    userLoggedInFailed(response.left);
                    const formatted = wrap(response.left);
                    return h.response(formatted).code(formatted.status);
                }
                userLoggedInEvent(response.right.userId);
                return h.response(response.right).code(200);
            },
            auth: false,
            validate: {
                payload: LoginSchema,
            },
            tags: ['api', 'auth'],
            description: 'Login',
            notes: 'Login api  ',
        },
    });

    server.route({
        method: 'POST',
        path: '/auth/signup',
        options: {
            handler: async (request, h) => {
                const response = await authHandler.signUpUser(request.payload);
                if (isLeft(response)) {
                    const formatted = wrap(response.left);
                    return h.response(formatted).code(formatted.status);
                }
                return h.response(response.right).code(200);
            },
            auth: false,
            tags: ['api', 'user'],
            validate: {
                payload: SignUpSchema,
            },
            description: 'user sign up api',
            notes: 'takes in user and password',
        },
    });

    server.route({
        method: 'POST',
        path: '/auth/logout',
        options: {
            handler: async (request, h) => {
                await authHandler.logout(
                    request.auth.credentials.sessionId,
                );
                return h.response({}).code(200);
            },
            tags: ['api', 'auth'],
            description: 'logout',
            notes: 'Logout the user',
            auth: {
                scope: ['user'],
            },
        },
    });
}
