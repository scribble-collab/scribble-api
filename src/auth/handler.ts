import bcrypt from 'bcrypt';
import { Either, isLeft, left, right } from 'fp-ts/lib/Either';
import jwt from 'jsonwebtoken';
import _ from 'ramda';
import { userAccountCreated, userAccountCreationFailed } from '../logEvents';
import { v4 as uuidv4 } from 'uuid';
import * as userRepo from '../user/repo';
import * as repo from './repo';
import { LoginError, NewUser, UserRegistrationError, UserResponse } from './types';

const getUserToken = async (jwtSecret, user) => {
    const sessionId = uuidv4();
    await repo.saveSession(sessionId);

    const jwtToken = jwt.sign(
        { userId: user.id, scope: user.role, sessionId },
        jwtSecret,
    );
    return jwtToken;
};

export default function authenticationHandler(env) {
    return {
        login: async (
            loginDetails: NewUser,
        ): Promise<Either<LoginError, UserResponse>> => {
            const user = await userRepo.getByUsername(loginDetails.username);
            if (_.isNil(user)) {
                return left('invalidCredentials');
            }

            if(!user.active){
                return left('accountNotActive');
            }
        
            const match = await bcrypt.compare(
                loginDetails.password,
                user.password,
            );
            if (!match) {
                return left('invalidCredentials');
            }

            const jwtToken = await getUserToken(env.config.JWT_SECRET, user);
            return right({ authToken: jwtToken, userId: user.id });
        },

        signUpUser: async (
            signUpDetails: NewUser,
        ): Promise<Either<UserRegistrationError, UserResponse>> => {
            const result = await userRepo.saveUser(signUpDetails);
            if (isLeft(result)) {
                userAccountCreationFailed({
                    username: signUpDetails.username,
                    reason: result.left,
                });
                return result;
            }

            userAccountCreated({
                id: result.right,
                usernam: signUpDetails.username,
            });

            const jwtToken = await getUserToken(env.config.JWT_SECRET, result.right);
            return right({ authToken: jwtToken, userId: result.right.id });
        },

        getUserToken: (user) => getUserToken(env.config.JWT_SECRET, user),

        validateJWTToken: async (credentials) => {
            const currentSession = await repo.getSessionById(
                credentials.sessionId,
            );
            if (_.isNil(currentSession)) {
                return { isValid: false };
            }
            return { isValid: true };
        },

        logout: async (sessionId) => {
            await repo.deleteSession(sessionId);
        },
    };
}
