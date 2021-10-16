import winston from 'winston';
import config from './config';

const customFormat = winston.format((info) => {
    const update = info;
    update.message = 'scribble-';
    return update;
});

export default winston.createLogger({
    level: config.LOGGING_LEVEL ? 'debug' : 'info',
    transports: [
    //
    // - Write all logs error (and below) to `error.log`.
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        //
        // - Write to all logs with specified level to console.
        new winston.transports.Console({
            format: winston.format.combine(
                customFormat(),
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: process.argv.indexOf('--silent') >= 0,
        }),
    ],
});
