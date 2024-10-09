/**
 * An array of routes that do not require authentication.
 * @type {string[]} - An array of route paths.
 */
export const publicRoutes = [];

/**
 * An array of routes that are used for authentication.
 * These routes will redirect signed in users to the home page.
 * @type {string[]} - An array of route paths.
 */
export const authRoutes = ["/auth/sign-in", "/auth/sign-up", "/auth/error"];

/**
 * The prefix for the API authentication routes.
 * Routes that start with this prefix are used for api authentication.
 * @type {string}
 */
export const apiAuthPrefix = "/api/auth";

/**
 * The default redirect path after signing in.
 * This path is used when no redirect path is provided.
 * @type {string}
 */
export const DEFAULT_SIGN_IN_REDIRECT = "/";

/**
 * The default redirect path after signing up.
 * This path is used when no redirect path is provided.
 * @type {string}
 */
export const DEFAULT_SIGN_UP_REDIRECT = "/user/invitations";
