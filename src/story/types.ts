import * as joi from 'joi';

export const StoryCreationSchema = joi.object({
    title: joi.string().required(),
    description: joi.string().required(),
    body: joi.string().required(),
    tags: joi.array().required(),
    cover: joi.string().optional(),
    ref: joi.any().optional(),
}).label('story creation');

export const LikeSchema = joi.object({
    story: joi.any().required()
}).label('story like');

export const CommentSchema = joi.object({
    story: joi.any().required(),
    comment: joi.string().required()
}).label('story comment');

export const PageSchema = joi.object({
    page: joi.number().optional().default(0)
}).label('page for pagination');

export interface StoryCreationDetails {
    title: string,
    description: string,
    body: string,
    tags: string[],
    author: string,
    cover?: string,
    ref?: string,
}

export interface Story {
    title: string,
    description: string,
    body: string,
    author: string,
    cover?: string,
    ref?: string,
}

export interface Tag {
    tag: string
}

export interface CommentDetails {
    story: string,
    userId: string,
    comment: string
}

export interface LikeDetails {
    story: string,
    userId: string
}