import * as joi from 'joi';
import * as R from 'ramda';
import { StorySortType } from './utils';

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

export const StorySearchSchema = joi.object({
    type: joi.string().valid(
        'ORIGINAL',
        'VERSION',
        'ALL'
    ).required(),
    sort: joi.string().valid(
        ...R.keys(StorySortType)
    ).required(),
    query: joi.string().optional(),
    limit: joi.number().default(100).optional(),
    offset: joi.number().default(0).optional(),
}).label('story search schema');

export type StorySearchType = 
    | 'ORIGINAL'
    | 'VERSION'
    | 'ALL';

export interface SearchStoryParams {
    type: StorySearchType,
    sort: string,
    limit: number,
    offset: number,
    query?: string,
}

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