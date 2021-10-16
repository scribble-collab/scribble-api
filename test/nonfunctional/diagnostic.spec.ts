import chai, { expect } from 'chai';
import 'mocha';
import { getTestEnv } from '../env/testEnvironment';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

describe('diagnostic', async () => {
    let testEnv;

    beforeEach(async () => {
        testEnv = await getTestEnv();
    });

    it('respond to ping', async () => {
        const response = await testEnv.server.inject({
            method: 'get',
            url: '/internal/ping',
        });
        expect(response).to.have.status(200);
    });
});
