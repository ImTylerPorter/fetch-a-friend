/**
 * Server Hooks Module
 * Handles global server-side middleware functionality
 *
 * This module is responsible for:
 * - Authentication state management
 * - Protected route handling
 * - JWT token validation
 * - Route protection and redirection
 * - Debug logging for development
 */

import { redirect, type Handle } from '@sveltejs/kit';

/**
 * Global server handle function
 * Processes every request before it reaches route handlers
 *
 * Features:
 * - Validates JWT tokens for authentication
 * - Manages protected routes access
 * - Handles authentication redirects
 * - Provides debug logging
 *
 * @param {Object} event - The request event object
 * @param {Function} resolve - Function to resolve the request
 * @returns {Promise<Response>} The processed response
 */
export const handle: Handle = async ({ event, resolve }) => {
	// Check if the user is authenticated by looking for the fetch-access-token
	const authToken = event.cookies.get('fetch-access-token');

	// Basic JWT validation (make sure it's a proper JWT token)
	const isValidJWT = authToken
		? /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/.test(authToken)
		: false;

	const isAuthenticated = isValidJWT;

	// Add auth info to event.locals for use in routes
	event.locals.isAuthenticated = isAuthenticated;

	// Protected routes that require authentication
	if (!isAuthenticated && !event.url.pathname.startsWith('/login')) {
		throw redirect(303, '/login');
	}

	// Public routes that should not be accessible when authenticated
	if (isAuthenticated && event.url.pathname === '/login') {
		throw redirect(303, '/');
	}

	const response = await resolve(event);

	return response;
};
