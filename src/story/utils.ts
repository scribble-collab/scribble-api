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

export const StorySortType = {
    'LIKES_ASC': 'ORDER BY stories.likes ASC',
    'LIKES_DESC': 'ORDER BY stories.likes DESC',
    'COMMENTS_ASC': 'ORDER BY stories.comments ASC',
    'COMMENTS_DESC': 'ORDER BY stories.comments DESC',
    'CREATED_ASC': 'ORDER BY stories."createdAt" ASC',
    'CREATED_DESC': 'ORDER BY stories."createdAt" DESC',
    'UPDATED_ASC': 'ORDER BY stories."updatedAt" ASC',
    'UPDATED_DESC': 'ORDER BY stories."updatedAt" DESC'
}