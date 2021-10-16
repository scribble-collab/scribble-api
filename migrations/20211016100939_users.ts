import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
    const query = `
      
    CREATE TABLE users (
      id serial PRIMARY KEY,
      "createdAt" timestamptz DEFAULT now(),
      "updatedAt" timestamptz DEFAULT now(),

      username TEXT,
      email TEXT,
      password TEXT,
      avatar TEXT,
      bio TEXT,
      role TEXT DEFAULT 'user',
      active BOOLEAN DEFAULT TRUE, 
      metadata JSONB
    );

    CREATE OR REPLACE FUNCTION update_updated_at()
    RETURNS trigger AS
    $$      
    begin
    NEW."updatedAt" = now();
    RETURN NEW;
    END;
    $$
    LANGUAGE 'plpgsql';
          
    CREATE TRIGGER users_updated
    BEFORE INSERT OR UPDATE
    ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at();

    CREATE TABLE session (
      "sessionId" VARCHAR (50) PRIMARY KEY,
      "createdAt" timestamptz DEFAULT now(),
      "lastUsed" timestamptz DEFAULT now(),
      "userId" INT REFERENCES users(id)
    );
  `;
    return knex.schema.raw(query);
}

export async function down(knex: Knex): Promise<void> {
    const query = `
    DROP TABLE IF EXISTS session CASCADE;
    DROP TABLE IF EXISTS users CASCADE;
  `;
    return knex.schema.raw(query);
}
