import dotenv from 'dotenv';
import _ from 'ramda';

dotenv.config();

const Config = {
    BASE_URL: process.env.BASE_URL || 'http://0.0.0.0:4000',
    PORT: process.env.PORT || 4000,
    JWT_SECRET: process.env.JWT_SECRET || 'pp~f}dbkwd]k1qpp@n1<:lljptymffd]k1q~f}dbkwdt>',
    LOGGING_LEVEL: process.env.LOGGING_LEVEL || 'debug',
    STATIC_FILES_BASE_PATH: 'user-files',
    STORAGE_BACKEND: 'localConsole',

    PAGINATION: process.env.PAGINATION || 20,
};

const Prod = _.merge(Config, {
    APP_ENV: 'Prod',
    DB_CONNECTION_URI: process.env.DB_CONNECTION_URI,
});

const Test = _.merge(Config, {
    APP_ENV: 'Test',
    DB_CONNECTION_URI: process.env.TEST_DB_CONNECTION_URI,
});

export = (() => {
    switch (process.env.NODE_ENV) {
    case 'Production':
        return Prod;
    case 'Test':
        return Test;
    default:
        return Prod;
    }
})();
