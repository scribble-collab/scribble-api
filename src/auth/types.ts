import * as joi from 'joi';

export const LoginSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(8).required(),
}).label('user login');

export const SignUpSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(8).required(),
}).label('sign up schema');

export interface NewUser {
    username: string,
    password: string,
}

export type UserRegistrationError =
    | 'userAlreadyExist'
    | 'passwordHashingFailed';

export interface UserResponse {
    authToken: string,
    userId: number | string,
}

export type LoginError =
    | 'invalidCredentials'
    | 'accountNotActive';
