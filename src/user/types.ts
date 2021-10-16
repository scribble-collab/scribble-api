import * as joi from 'joi';

export const SignUpSchema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(8).required(),
});

export interface NewUser {
    username: string,
    password: string,
}

export type UserRegistrationError =
    | 'userAlreadyExist'
    | 'passwordHashingFailed';

export type UserId = number;
