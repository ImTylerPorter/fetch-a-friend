/**
 * Favorites API Endpoints
 * Handles the management of user's favorite dogs through REST endpoints
 * Requires authentication for all operations
 */

import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { error } from '@sveltejs/kit';
import { PETFINDER_API_URL } from '$env/static/private';

/**
 * GET /api/favorites
 * Retrieves the current user's favorite dogs
 *
 * @throws {401} If user is not authenticated
 * @throws {500} If there's an error fetching favorites from the external API
 * @returns {Promise<Response>} JSON response containing array of favorite dog IDs
 */
export const GET: RequestHandler = async ({ locals }) => {
	if (!locals.isAuthenticated) {
		throw error(401, 'Not authenticated');
	}

	try {
		const response = await fetch(`${PETFINDER_API_URL}/favorites`, {
			headers: {
				Authorization: `Bearer ${locals.accessToken}`
			}
		});

		if (!response.ok) {
			throw error(response.status, 'Failed to fetch favorites');
		}

		const data = await response.json();
		return json({ favorites: data.favorites });
	} catch (e) {
		console.error('Error fetching favorites:', e);
		throw error(500, 'Failed to fetch favorites');
	}
};

/**
 * PUT /api/favorites
 * Updates the current user's favorite dogs
 *
 * @param {Request} request - Contains the new list of favorite dog IDs in the body
 * @throws {401} If user is not authenticated
 * @throws {500} If there's an error updating favorites in the external API
 * @returns {Promise<Response>} JSON response indicating success
 */
export const PUT: RequestHandler = async ({ locals, request }) => {
	if (!locals.isAuthenticated) {
		throw error(401, 'Not authenticated');
	}

	try {
		const { favorites } = await request.json();

		const response = await fetch(`${PETFINDER_API_URL}/favorites`, {
			method: 'PUT',
			headers: {
				Authorization: `Bearer ${locals.accessToken}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ favorites })
		});

		if (!response.ok) {
			throw error(response.status, 'Failed to update favorites');
		}

		return json({ success: true });
	} catch (e) {
		console.error('Error updating favorites:', e);
		throw error(500, 'Failed to update favorites');
	}
};
