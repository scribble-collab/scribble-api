export const wrap = (response) => {
    switch (response) {
    case 'userAlreadyExist':
        return { message: 'Username is taken', status: 403 };

    case 'passwordHashingFailed':
        return { message: 'Server encountered an error', status: 500 };

    case 'invalidCredentials':
        return { message: 'Invalid credentials!', status: 401 };

    case 'accountNotActive':
        return { message: 'Account is disabled', status: 401 }

    default:
        return { message: 'Server encountered an error', status: 500 };
    }
};