import { expect, version } from 'chai';
import { isLeft } from 'fp-ts/lib/Either';
import * as storyRepo from '../../src/story/repo';
import * as userRepo from '../../src/user/repo';
import * as commentRepo from '../../src/comment/repo';
import * as F from '../env/factories';
import * as R from 'ramda';
import { getTestEnv } from '../env/testEnvironment';

describe('story', async () => {
    let testEnv;
    let user;
    let headers;

    const story = {
        title: 'some title',
        description: 'some desc',
        body: 'som body',
        tags: ['new', 'new', 'test']
    }

    beforeEach(async () => {
        testEnv = await getTestEnv();
        await testEnv.resetDB();
        const res = await userRepo.saveUser(F.fakeUser({}));
        user = isLeft(res) ? res.left : res.right;
        const token = await testEnv.authHandler.getUserToken(user);
        headers = {
            Authorization: token
        }
    });

    it('should handler invalid story creations', async () => {
        const invalid = await testEnv.server.inject({
            method: 'post',
            url: '/story/create',
            payload: story
        });
        expect(invalid.statusCode).to.eql(401);

        const missing = await testEnv.server.inject({
            method: 'post',
            url: '/story/create',
            payload: { title: 'only title?' },
            headers: headers
        });
        expect(missing.statusCode).to.eql(400);
    });

    it('should create a story', async () => {
        const response = await testEnv.server.inject({
            method: 'post',
            url: '/story/create',
            payload: story,
            headers: headers
        });
        const db = await storyRepo.getUserStories(user.id);

        expect(response.statusCode).to.eql(200);
        expect(db.length).to.eql(1);
    });

    it('should add a like to story', async () => {
        const id = await storyRepo.saveStory({
            ...R.dissoc('tags', story),
            author: user.id
        });
        const response = await testEnv.server.inject({
            method: 'put',
            url: '/story/like',
            payload: {
                story: id
            },
            headers: headers
        });

        expect(response.statusCode).to.eql(200);
    });

    it('should add a comment a story', async () => {
        const id = await storyRepo.saveStory({
            ...R.dissoc('tags', story),
            author: user.id
        });
        const response = await testEnv.server.inject({
            method: 'put',
            url: '/story/comment',
            payload: {
                story: id,
                comment: 'nice'
            },
            headers: headers
        });

        await commentRepo.list(id);
        expect(response.statusCode).to.eql(200);
    });

    it('should retrieve all original stories', async () => {
        await storyRepo.saveStory({
            ...R.dissoc('tags', story),
            author: user.id
        });
        const response = await testEnv.server.inject({
            method: 'get',
            url: '/story?type=ALL&sort=UPDATED_DESC',
            headers: headers
        });

        const originals = await testEnv.server.inject({
            method: 'get',
            url: '/story?type=ORIGINAL&sort=UPDATED_DESC',
            headers: headers
        });

        const versions = await testEnv.server.inject({
            method: 'get',
            url: '/story?type=VERSION&sort=UPDATED_DESC',
            headers: headers
        });


        expect(response.statusCode).to.eql(200);
        expect(originals.statusCode).to.eql(200);
        expect(versions.statusCode).to.eql(200);
    });
});