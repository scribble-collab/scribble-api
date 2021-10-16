import * as hapi from '@hapi/hapi';

export default function (server: hapi.Server) {
    server.route({
        method: 'GET',
        path: '/internal/ping',
        options: {
            handler: () => 'pong',
            tags: ['api', 'auth'],
            auth: false,
            description: 'Returns pong',
            notes: 'Diagnostic API responding to ping',
        },
    });
}
