/**
 * Server-side logic for the login page
 * Handles user authentication and session management
 */

import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthService } from '$lib/services/auth';
import type { LoginFormData } from '$lib/types/auth';

/**
 * Load function for the login page
 * Checks if user is already authenticated and provides initial state
 *
 * @returns {Object} Object containing authentication status
 */
export const load: PageServerLoad = ({ locals }) => {
	return {
		isAuthenticated: locals.isAuthenticated
	};
};

/**
 * Form actions for the login page
 * Handles the login form submission and authentication process
 */
export const actions = {
	/**
	 * Default action handler for login form submission
	 * - Validates form data
	 * - Attempts authentication
	 * - Sets authentication cookies on success
	 *
	 * @param {Request} request - The form submission request
	 * @param {Cookies} cookies - Cookie store for session management
	 * @returns {Promise<Object>} Success response or validation error
	 * @throws {400} If required fields are missing
	 * @throws {500} If authentication fails
	 */
	default: async ({ request, cookies }) => {
		const data = await request.formData();
		const formData: Partial<LoginFormData> = {
			name: data.get('name')?.toString(),
			email: data.get('email')?.toString()
		};

		// Validate required fields
		if (!formData.name || !formData.email) {
			return fail(400, {
				error: 'Name and email are required',
				data: formData
			});
		}

		try {
			// Attempt authentication
			const response = await AuthService.login(formData);

			if (!response.ok) {
				const errorData = await response.json();
				return fail(response.status, {
					error: errorData.message || 'Authentication failed. Please try again.',
					data: formData
				});
			}

			// Set authentication cookies
			const setCookieHeader = response.headers.get('set-cookie');
			if (setCookieHeader) {
				const token = AuthService.extractAuthToken(setCookieHeader);
				if (token) {
					cookies.set('fetch-access-token', token, {
						path: '/',
						httpOnly: true,
						secure: true,
						sameSite: 'lax'
					});
				}
			}

			return { success: true };
		} catch (err) {
			console.error('Login error:', err);
			return fail(500, {
				error: 'An unexpected error occurred. Please try again later.',
				data: formData
			});
		}
	}
} satisfies Actions;
