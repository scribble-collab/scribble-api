import bcrypt from 'bcrypt';
import { Either, left, right } from 'fp-ts/lib/Either';
import _ from 'ramda';
import db from '../db';
import { NewUser, UserRegistrationError } from './types';

const userTable = 'users';

export const getByUsername = async (username: string) => {
    return db(userTable).select('*').where({ username }).first();
}

export const getUserPasswordByUserId = async (userId) => {
    return db(userTable).select('*').where({ id: userId }).first();
}

export const updateUserDetails = async (userId, newDetails) => {
    return db(userTable)
        .update({ ...newDetails })
        .where({ id: userId });
}

export const saveUser = async (user: NewUser,)
    : Promise<Either<UserRegistrationError, any>> => {
    const existingUser = await getByUsername(user.username);
    if (!_.isNil(existingUser)) {
        return left('userAlreadyExist');
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);
    if (!hashedPassword) {
        return left('passwordHashingFailed');
    }
    const row = await db(userTable)
        .insert({ ...user, password: hashedPassword })
        .returning('*');

    return right(row[0]);
}
