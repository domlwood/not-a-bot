export const jwtConstants = {
    // TODO: set JWT_SECRET before deploying anywhere real - this
    // fallback is only safe for local dev. Read once here so the module
    // (signing) and the strategy (verifying) can never disagree on it.
    secret: process.env.JWT_SECRET ?? 'dev-secret-change-me',
};

// Anonymous queue sessions expire after 24h; there is no refresh - the
// caller just rejoins the queue (POST /queue) for a new one.
export const SESSION_TTL_SECONDS = 24 * 60 * 60;
