/**
 * Location service for the Fetch A Friend application.
 * Handles location-based operations including searching by ZIP code, city, or state.
 */

import { PUBLIC_API_URL } from '$env/static/public';
import type { Location } from '$lib/types/dog';
import { isStateCode, isZipCode } from '$lib/utils/search';

/**
 * Response interface for location search requests
 */
interface LocationSearchResponse {
	results: Location[];
	total: number;
}

/**
 * Configuration interface for API requests
 */
interface RequestConfig {
	authToken?: string;
}

/**
 * Creates base configuration for API requests
 * @param {RequestConfig} config - Optional configuration including auth token
 * @returns Base configuration object with credentials and headers
 */
const getBaseConfig = (config?: RequestConfig) => {
	const baseConfig = {
		credentials: 'include' as const,
		headers: {
			'Content-Type': 'application/json'
		} as Record<string, string>
	};

	if (config?.authToken) {
		baseConfig.headers = {
			...baseConfig.headers,
			Cookie: `fetch-access-token=${config.authToken}`
		};
	}

	return baseConfig;
};

export class LocationService {
	/**
	 * Searches for locations based on a query string
	 * Handles ZIP codes, city names, and state codes differently
	 * For city searches, automatically fetches all available results through pagination
	 *
	 * @param {string} query - The search query (ZIP code, city name, or state code)
	 * @param {RequestConfig} config - Optional request configuration
	 * @returns {Promise<Location[]>} Array of matching locations
	 * @throws {Error} If the search request fails
	 */
	static async searchLocations(query: string, config?: RequestConfig): Promise<Location[]> {
		const cleanQuery = query.trim();

		// If it's a zip code, return it directly without searching
		if (isZipCode(cleanQuery)) {
			return [
				{
					zip_code: cleanQuery,
					latitude: 0,
					longitude: 0,
					city: '',
					state: '',
					county: ''
				}
			];
		}

		// Build search body based on input type
		const searchBody = isStateCode(cleanQuery)
			? { states: [cleanQuery.toUpperCase()], size: 100 }
			: { city: cleanQuery, size: 100 };

		const response = await fetch(`${PUBLIC_API_URL}/locations/search`, {
			method: 'POST',
			...getBaseConfig(config),
			body: JSON.stringify(searchBody)
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Location search failed:', {
				status: response.status,
				statusText: response.statusText,
				error: errorText
			});
			throw new Error(`Failed to search locations: ${errorText}`);
		}

		const data: LocationSearchResponse = await response.json();

		// For city searches, ensure we get all zip codes through pagination
		if (!searchBody.states && data.total > data.results.length) {
			const allResults: Location[] = [...data.results];
			let from = data.results.length;

			while (allResults.length < data.total) {
				const nextResponse = await fetch(`${PUBLIC_API_URL}/locations/search`, {
					method: 'POST',
					...getBaseConfig(config),
					body: JSON.stringify({ ...searchBody, from })
				});

				if (!nextResponse.ok) break;

				const nextData: LocationSearchResponse = await nextResponse.json();
				allResults.push(...nextData.results);
				from += nextData.results.length;

				if (nextData.results.length === 0) break;
			}

			return allResults;
		}

		return data.results;
	}
}
