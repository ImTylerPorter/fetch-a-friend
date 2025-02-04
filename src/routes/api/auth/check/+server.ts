/**
 * Authentication Check API Endpoint
 * Provides a way to verify the current authentication status
 * Used by the client to periodically check if the session is still valid
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * GET /api/auth/check
 * Checks if the current user's session is valid
 *
 * @returns {Promise<Response>}
 *   - 200 with JSON {status: 'authenticated'} if session is valid
 *   - 401 with empty body if session is invalid or expired
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.isAuthenticated) {
		return new Response(null, { status: 401 });
	}
	return json({ status: 'authenticated' });
};
