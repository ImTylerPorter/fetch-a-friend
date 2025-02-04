/**
 * Logout Endpoint
 * Handles user logout process and session cleanup
 * Features:
 * - Calls auth service to invalidate session
 * - Clears all authentication cookies
 * - Redirects to login page
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthService } from '$lib/services/auth';

/**
 * POST /logout
 * Handles the logout request and cleanup
 *
 * @param {Cookies} cookies - Cookie store for session management
 * @throws {303} Redirects to login page after successful logout
 */
export const POST: RequestHandler = async ({ cookies }) => {
	try {
		// Attempt to logout through auth service
		await AuthService.logout();
	} catch (error) {
		console.error('Logout error:', error);
	}

	// Always clear cookies, even if the API call fails
	cookies.delete('fetch-access-token', { path: '/' });
	cookies.delete('AWSALB', { path: '/' });
	cookies.delete('AWSALBCORS', { path: '/' });

	// Redirect to login page
	throw redirect(303, '/login');
};
