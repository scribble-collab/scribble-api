export const wrap = (response) => {
    switch (response) {
    case 'storyCreationFailed':
        return { message: 'Server encountered an error', status: 500 };

    case 'storyAdded':
        return { message: 'Story created successfully', status: 200 };

    case 'commentAddingFailed':
        return { message: 'Server encountered an error', status: 500 };

    case 'commentAdded':
        return { message: 'Comment added successfully', status: 200 };

    case 'likeAddingFailed':
        return { message: 'Server encountered an error', status: 500 };

    case 'likeAdded':
        return { message: 'Like added successfully', status: 200 };

    default:
        return { message: 'Server encountered an error', status: 500 };
    }
};