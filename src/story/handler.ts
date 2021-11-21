import { Either, left, right } from 'fp-ts/lib/Either';
import * as R from 'ramda';
import * as commentRepo from '../comment/repo';
import * as likeRepo from '../like/repo';
import * as repo from './repo';
import {
    CommentDetails,
    LikeDetails,
    SearchStoryParams,
    StoryCreationDetails
} from './types';

export default function storyHandler() {
    return {
        createStory: async (story: StoryCreationDetails): Promise<Either<string, string>> => {
            const id = await repo.saveStory(R.dissoc('tags', story));
            if (R.isNil(id))
                return left('storyAddingFailed');

            const tags = await repo.saveTags(R.map((x) => { return { tag: x } }, story.tags));
            R.map((tag) => repo.saveStoryTags(tag, id), tags);

            return right('storyAdded');
        },

        searchStories: async (params: SearchStoryParams) => {
            const type = params.type;
            const details: any = R.dissoc('type', params);

            if (type === 'ORIGINAL')
                return await repo.getOriginalStories(details);
            else if (type === 'VERSION')
                return await repo.getVersionStories(details);

            return await repo.getAllStories(details);
        },

        likeStory: async (like: LikeDetails) => {
            const id = await likeRepo.addLike(like.story, like.userId);
            if (R.isNil(id))
                return left('likeAddingFailed');

            return right('likeAdded');
        },

        commentStory: async (comment: CommentDetails) => {
            const id = await commentRepo.addComment(comment.story, comment.userId, comment.comment);
            if (R.isNil(id))
                return left('commentAddingFailed');

            return right('commentAdded');
        }
    }
}