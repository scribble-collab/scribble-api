import logger from './logger';

export type GeneralEvents = 'file-uploaded';

export type UserEvents =
    | 'user-account-created'
    | 'user-account-creation-failed'
    | 'user-login-successful'
    | 'user-login-failed';

export type EventName =
    | GeneralEvents
    | UserEvents;

export function logEvent(
    eventName: EventName,
    eventData: any,
    level = 'info',
) {
    logger.log(level, { eventName, eventData });
}

export function fileUploadedEvent(fileDetails) {
    logEvent('file-uploaded', { fileDetails });
}

// user events
export function userAccountCreated(userDetails) {
    logEvent('user-account-created', userDetails);
}

export function userAccountCreationFailed(email) {
    logEvent('user-account-creation-failed', email);
}

export function userLoggedInEvent(userId) {
    logEvent('user-login-successful', { userId: userId });
}

export function userLoggedInFailed(reason) {
    logEvent('user-login-failed', { reason });
}
