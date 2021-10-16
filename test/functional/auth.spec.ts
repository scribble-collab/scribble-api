import { expect } from 'chai';
import * as userRepo from '../../src/user/repo';
import * as F from '../env/factories';
import { getTestEnv } from '../env/testEnvironment';

describe('auth', async () => {
    let testEnv;
    let user;

    beforeEach(async () => {
        testEnv = await getTestEnv();
        await testEnv.resetDB();
        user = F.fakeUser({});
        await userRepo.saveUser(user);
    });

    it('login should return handle invalid credentials', async () => {
        const response = await testEnv.server.inject({
            method: 'post',
            url: '/auth/login',
            payload: {
                username: 'a' + user.username,
                password: user.password,
            },
        });
        expect(response.statusCode).to.eql(401);

        const invalidPasswordResponse = await testEnv.server.inject({
            method: 'post',
            url: '/auth/login',
            payload: {
                username: user.username,
                password: 'a' + user.password,
            },
        });
        expect(invalidPasswordResponse.statusCode).to.eql(401);
    });

    it('should login a user', async () => {
        const response = await testEnv.server.inject({
            method: 'post',
            url: '/auth/login',
            payload: {
                username: user.username,
                password: user.password,
            },
        });
        expect(response.statusCode).to.eql(200);
    });

    it('logout expires the session', async () => {
        const noAuthTokenResponse = await testEnv.server.inject({
            method: 'post',
            url: '/auth/logout',
        });
        expect(noAuthTokenResponse.statusCode).to.eql(401);

        const invalidAuthTokenResponse = await testEnv.server.inject({
            method: 'post',
            url: '/auth/logout',
            headers: { Authorization: 'invalidToken' },
        });
        expect(invalidAuthTokenResponse.statusCode).to.eql(401);

        const response = await testEnv.server.inject({
            method: 'post',
            url: '/auth/login',
            payload: {
                username: user.username,
                password: user.password,
            },
        });
        expect(response.statusCode).to.eql(200);

        const authToken = response.result.authToken;

        const logOutResponse = await testEnv.server.inject({
            method: 'post',
            url: '/auth/logout',
            headers: { Authorization: authToken },
        });

        expect(logOutResponse.statusCode).to.eql(200);

        const afterLogOutResponse = await testEnv.server.inject({
            method: 'post',
            url: '/auth/logout',
            headers: { Authorization: authToken },
        });

        expect(afterLogOutResponse.statusCode).to.eql(401);
    });

    it('sign up handles bad request', async () => {
        const newUser = {
            username: 'John',
        };

        const response = await testEnv.server.inject({
            method: 'post',
            url: '/auth/signup',
            payload: newUser,
        });
        expect(response.statusCode).to.eql(400);
    });

    it('user should able to sign up', async () => {
        const newUser = {
            username: 'john.watson@gmail.com',
            password: '12345678',
        };
        const response = await testEnv.server.inject({
            method: 'post',
            url: '/auth/signup',
            payload: newUser,
        });
        expect(response.statusCode).to.eql(200);
    });
});
