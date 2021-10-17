import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
    const query = `
        CREATE TABLE stories (
            id serial PRIMARY KEY,
            "createdAt" timestamptz DEFAULT now(),
            "updatedAt" timestamptz DEFAULT now(),

            title TEXT,
            description TEXT,
            body TEXT,
            likes BIGINT DEFAULT 0,
            comments BIGINT DEFAULT 0,
            slug TEXT,
            cover TEXT,

            author INT REFERENCES users(id) DEFAULT NULL,
            ref INT REFERENCES stories(id) DEFAULT NULL
        );

        CREATE TABLE tags (
            id serial PRIMARY KEY,
            "createdAt" timestamptz DEFAULT now(),

            tag VARCHAR(20) UNIQUE
        );

        CREATE TABLE story_tags (
            id serial,
            "createdAt" timestamptz DEFAULT now(),

            "storyId" INT REFERENCES stories(id),
            "tagId" INT REFERENCES tags(id),
            PRIMARY KEY ("storyId", "tagId")
        );

        CREATE TABLE likes (
            id SERIAL,
            "createdAt" timestamptz DEFAULT now(),

            "userId" INT REFERENCES users(id) ON DELETE CASCADE, 
            "storyId" INT REFERENCES stories(id) ON DELETE CASCADE,
            PRIMARY KEY ("userId", "storyId")
        );

        CREATE TABLE comments (
            id SERIAL PRIMARY KEY,
            "createdAt" timestamptz DEFAULT now(),

            "userId" INT REFERENCES users(id) ON DELETE CASCADE, 
            "storyId" INT REFERENCES stories(id) ON DELETE CASCADE,
            comment TEXT
        );

        CREATE OR REPLACE  FUNCTION update_like_count()
        RETURNS trigger AS
        $$
        BEGIN                                                                                                                     
            UPDATE stories SET likes = likes + 1 where id = NEW."storyId"; 
            RETURN NEW;                                               
        END;                                                                                                                 
        $$ LANGUAGE plpgsql;

        CREATE OR REPLACE FUNCTION update_comment_count()
        RETURNS trigger AS
        $$
        BEGIN                                                                                                                     
            UPDATE stories SET comments = comments + 1 where id = NEW."storyId"; 
            RETURN NEW;                                               
        END;                                                                                                                 
        $$ LANGUAGE plpgsql;

        CREATE TRIGGER update_like_count
            BEFORE INSERT ON likes
            FOR EACH ROW
            EXECUTE PROCEDURE update_like_count();
        
        CREATE TRIGGER update_comment_count
            BEFORE INSERT ON comments
            FOR EACH ROW
            EXECUTE PROCEDURE update_comment_count();

        CREATE TRIGGER stories_updated
            BEFORE INSERT OR UPDATE
            ON stories
            FOR EACH ROW
            EXECUTE PROCEDURE update_updated_at();

    `;
    return knex.schema.raw(query);
}


export async function down(knex: Knex): Promise<void> {
    const query = `
        DROP TABLE IF EXISTS comments CASCADE;
        DROP TABLE IF EXISTS likes CASCADE;
        DROP TABLE IF EXISTS story_tags CASCADE;
        DROP TABLE IF EXISTS tags CASCADE;
        DROP TABLE IF EXISTS stories CASCADE;

        DROP FUNCTION IF EXISTS update_like_count CASCADE;
        DROP FUNCTION IF EXISTS update_comment_count CASCADE;
    `;
    return knex.schema.raw(query);
}

