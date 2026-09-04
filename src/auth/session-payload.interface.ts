/**
 * Every session in this system is anonymous - it's just a queue ticket,
 * not an identity - so there's nothing to distinguish beyond the id.
 */
export interface SessionPayload {
    /** Queue session id (subject) */
    sub: string;
}
