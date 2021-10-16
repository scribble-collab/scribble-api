import chai, { expect } from 'chai';
import 'mocha';
import { getTestEnv } from '../env/testEnvironment';
import chaiHttp from 'chai-http';
chai.use(chaiHttp);

describe('swagger', async () => {
    let testEnv;

    beforeEach(async () => {
        testEnv = await getTestEnv();
    });

    it('returns the swagger documentation', async () => {
        const swaggerUIResponse = await testEnv.server.inject({
            method: 'get',
            url: '/documentation',
        });
        expect(swaggerUIResponse).to.have.status(200);
        expect(swaggerUIResponse).to.be.html;

        const response = await testEnv.server.inject({
            method: 'get',
            url: '/swagger.json',
        });
        expect(response).to.have.status(200);
        expect(response).to.be.json;
    });
});
