import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    const query = `
        CREATE TABLE followers (
            id serial,
            "createdAt" timestamptz DEFAULT now(),

            "userId" INT REFERENCES users(id),
            "followerId" INT REFERENCES users(id),
            PRIMARY KEY("userId", "followerId")
        );
    `;
    return knex.schema.raw(query);
}


export async function down(knex: Knex): Promise<void> {
    const query = `
        DROP TABLE IF EXISTS followers CASCADE;
    `;
    return knex.schema.raw(query);
}
