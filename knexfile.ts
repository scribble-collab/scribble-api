import PostgressConnectionStringParser from 'pg-connection-string';
import config from './src/config';

const connectionOptions = PostgressConnectionStringParser.parse(config.DB_CONNECTION_URI || '');

module.exports = {
    client: 'pg',
    connection: {
        host: connectionOptions.host,
        port: connectionOptions.port,
        database: connectionOptions.database,
        user: connectionOptions.user,
        password: connectionOptions.password,
        ssl: connectionOptions.ssl,
    },
    pool: {
        min: 2,
        max: 10,
    },
    migrations: {
        tableName: 'knex_migrations',
    },
};
