/**
 * Root Layout Server Load Function
 * Provides server-side data for the root layout of the application
 *
 * This module is responsible for:
 * - Loading authentication state for all routes
 * - Making authentication status available to all child routes
 * - Providing global server-side data through locals
 */

import type { LayoutServerLoad } from './$types';

/**
 * Server-side load function for the root layout
 * Executed on every page request to determine authentication state
 *
 * @param {Object} params - SvelteKit load function parameters
 * @param {Object} params.locals - Server-side locals containing session data
 * @returns {Object} Object containing authentication status for client-side use
 */
export const load: LayoutServerLoad = ({ locals }) => {
	return {
		isAuthenticated: locals.isAuthenticated
	};
};
