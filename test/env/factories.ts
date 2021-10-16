import * as Faker from 'faker';
import * as _ from 'ramda';

export function fakeUser(options) {
    const user = {
        username: Faker.name.firstName(),
        password: Faker.internet.password(),
    };
    return _.mergeRight(user, options);
}
