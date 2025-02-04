/**
 * Server-side logic for the favorites page
 * Handles data loading and authentication checks for favorite dogs
 */

import { error, redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { DogService } from '$lib/services/dogs';

/**
 * Load function for the favorites page
 * - Checks authentication status
 * - Retrieves favorite dogs from cookies
 * - Fetches full dog details for favorites
 * - Optionally generates a match from favorites
 *
 * @throws {303} Redirects to login if user is not authenticated
 * @throws {500} If there's an error fetching dog details
 */
export const load: PageServerLoad = async ({ locals, cookies }) => {
	// Ensure user is authenticated
	if (!locals.isAuthenticated) {
		throw redirect(303, '/login');
	}

	try {
		const authToken = cookies.get('fetch-access-token');

		// Get favorite dog IDs from cookie
		const favoritesStr = cookies.get('favorites');
		const favoriteIds = favoritesStr ? JSON.parse(favoritesStr) : [];

		// If no favorites, return early
		if (!favoriteIds.length) {
			return {
				dogs: [],
				matchedDog: null
			};
		}

		// Fetch full details for favorite dogs
		const dogs = await DogService.getDogs(favoriteIds, { authToken });

		// Generate a match if we have favorites
		const match = await DogService.generateMatch(favoriteIds, { authToken });

		// Find the matched dog from our fetched dogs
		const matchedDog = dogs.find((dog) => dog.id === match.match) || null;

		return {
			dogs,
			matchedDog
		};
	} catch (e) {
		console.error('Error loading favorites:', e);
		throw error(500, 'Failed to load favorites');
	}
};
