import * as hapi from '@hapi/hapi';
import * as inert from '@hapi/inert';
import * as vision from '@hapi/vision';
import * as jwt from 'hapi-auth-jwt2';
import * as swagger from 'hapi-swagger';
import Path from 'path';
import authenticationHandler from './auth/handler';
import AuthenticationRouter from './auth/router';
import DiagnosticRouter from './diagnostic/router';
import fileHandler from './files/handler';
import FileRouter from './files/router';
import { FileStorageBackend } from './files/types';


export const init = async (
    config,
    storageBackend: FileStorageBackend,
) => {
    const server = hapi.server({
        port: config.PORT,
        host: '0.0.0.0',
        routes: {
            files: {
                relativeTo: Path.join(__dirname, '..', config.STATIC_FILES_BASE_PATH),
            },
            cors: {
                origin: ['*'],
            },
        },
    });

    // docs
    const swaggerOptions = {
        info: {
            title: 'Scribble API Documentation',
            version: '0.0.1',
        },
        host: `${config.BASE_URL}`,
        securityDefinitions: {
            jwt: {
                type: 'apiKey',
                name: 'Authorization',
                in: 'header',
            },
        },
        security: [{ jwt: [] }],
    };

    // plugins
    await server.register([
        inert,
        vision,
        {
            plugin: swagger,
            options: swaggerOptions,
        },
        {
            plugin: jwt,
        },
    ]);

    const env = {
        config: config,
    };

    const authenticationHandlerObj = authenticationHandler(env);
    const fileHandlerObj = fileHandler(env, storageBackend);

    // auth
    server.auth.strategy('jwt', 'jwt', {
        key: config.JWT_SECRET,
        validate: authenticationHandlerObj.validateJWTToken,
    });
    server.auth.default('jwt');

    // routers
    AuthenticationRouter(server, authenticationHandlerObj);
    DiagnosticRouter(server);
    FileRouter(server, fileHandlerObj);

    await server.initialize();
    return {
        server,
        handlers: {
            authHandler: authenticationHandlerObj,
        },
    };
};
