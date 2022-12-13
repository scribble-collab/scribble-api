import config from './config';
import localFileStorage from './files/storageBackend.local';
import { FileStorageBackend } from './files/types';
import logger from './logger';
import * as Server from './server';

// Catch unhandled unexpected exceptions
process.on('uncaughtException', (error: Error) => {
    logger.error({ error: error, type: 'uncaughtException' });
    console.error(`uncaughtException ${error.message}`);
});

// Catch unhandled rejected promises
process.on('unhandledRejection', (reason: any) => {
    logger.error({ reason: reason, type: 'unhandledRejection' });
    console.error(`unhandledRejection ${reason}`);
});

const start = async () => {
    try {
        const storageBackend: FileStorageBackend = localFileStorage(config);

        const { server } = await Server.init(config, storageBackend);
        await server.start();

        console.log('Server running at:', server.info.uri);

        server.events.on('response', function (request) {
            console.log(
                request.info.remoteAddress +
                ': ' +
                request.method.toUpperCase() +
                ' ' +
                request.path +
                ' --> ' +
                request.response.statusCode,
            );
        });
    } catch (err) {
        console.error('Error starting server: ', err);
        throw err;
    }
};

start();
