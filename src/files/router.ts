import * as Hapi from '@hapi/hapi';
import * as Joi from 'joi';

export default function (server: Hapi.Server, handler) {
    server.route({
        method: 'POST',
        path: '/file/upload',
        options: {
            handler: async (request, h) => {
                const response = await handler.uploadFile(request.payload.file);
                return h.response(response).code(200);
            },
            auth: {
                scope: ['user', 'superUser'],
            },
            payload: {
                maxBytes: 1048576 * 2,
                output: 'stream',
                multipart: true,
                allow: 'multipart/form-data',
            },
            validate: {
                payload: Joi.object({
                    file: Joi.any().meta({ swaggerType: 'file' }),
                }).label('file upload'),
            },
            tags: ['api', 'file'],
            description: 'Upload file',
            notes: 'File upload',
        },
    });

    server.route({
        method: 'GET',
        path: '/media/{param*}',
        options: {
            auth: false,
            handler: {
                directory: {
                    path: '.',
                    redirectToSlash: true,
                },
            },
        },
    });
}
