/**
 * Dogs service for the Fetch A Friend application.
 * Handles all dog-related API operations including searching, fetching details, and matching.
 */

import { PUBLIC_API_URL } from '$env/static/public';
import type { Dog, SearchParams, SearchResponse } from '$lib/types/dog';

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
			Accept: 'application/json'
		} as Record<string, string>
	};

	// If we have an auth token (server-side), add it to headers
	if (config?.authToken) {
		baseConfig.headers = {
			...baseConfig.headers,
			Cookie: `fetch-access-token=${config.authToken}`
		};
	}

	return baseConfig;
};

/**
 * Creates configuration for JSON requests
 * Extends base config with Content-Type header
 */
const getJsonConfig = (config?: RequestConfig) => {
	const baseConfig = getBaseConfig(config);
	return {
		...baseConfig,
		headers: {
			...baseConfig.headers,
			'Content-Type': 'application/json'
		}
	};
};

export class DogService {
	/**
	 * Fetches all available dog breeds
	 * @param {RequestConfig} config - Optional request configuration
	 * @returns {Promise<string[]>} Array of breed names
	 * @throws {Error} If the API request fails
	 */
	static async getBreeds(config?: RequestConfig): Promise<string[]> {
		try {
			const response = await fetch(`${PUBLIC_API_URL}/dogs/breeds`, {
				method: 'GET',
				...getBaseConfig(config)
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Breeds API Error:', {
					status: response.status,
					statusText: response.statusText,
					body: errorText
				});
				throw new Error(`Failed to fetch dog breeds: ${errorText}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Breeds API call failed:', error);
			throw error;
		}
	}

	/**
	 * Searches for dogs based on provided criteria
	 * @param {SearchParams} params - Search parameters including breeds, age, location, etc.
	 * @param {RequestConfig} config - Optional request configuration
	 * @returns {Promise<SearchResponse>} Search results including dog IDs and pagination info
	 * @throws {Error} If the search request fails
	 */
	static async searchDogs(params: SearchParams, config?: RequestConfig): Promise<SearchResponse> {
		try {
			const searchParams = new URLSearchParams();

			// Handle array parameters - these need to be sent as repeated query parameters
			if (params.breeds?.length) {
				params.breeds.forEach((breed) => searchParams.append('breeds', breed));
			}
			if (params.zipCodes?.length) {
				params.zipCodes.forEach((zip) => searchParams.append('zipCodes', zip));
			}

			// Handle numeric parameters
			if (typeof params.ageMin === 'number')
				searchParams.append('ageMin', params.ageMin.toString());
			if (typeof params.ageMax === 'number')
				searchParams.append('ageMax', params.ageMax.toString());
			if (typeof params.size === 'number') searchParams.append('size', params.size.toString());
			if (typeof params.from === 'number') searchParams.append('from', params.from.toString());

			// Handle string parameters
			if (params.sort) searchParams.append('sort', params.sort);

			const response = await fetch(`${PUBLIC_API_URL}/dogs/search?${searchParams}`, {
				method: 'GET',
				...getBaseConfig(config)
			});

			if (!response.ok) {
				const errorText = await response.text();
				console.error('Search API Error:', {
					status: response.status,
					statusText: response.statusText,
					body: errorText,
					url: `${PUBLIC_API_URL}/dogs/search?${searchParams}`
				});
				throw new Error(`Failed to search dogs: ${errorText}`);
			}

			const data = await response.json();
			return data;
		} catch (error) {
			console.error('Search API call failed:', error);
			throw error;
		}
	}

	/**
	 * Fetches detailed information for specific dogs
	 * @param {string[]} dogIds - Array of dog IDs to fetch
	 * @param {RequestConfig} config - Optional request configuration
	 * @returns {Promise<Dog[]>} Array of dog objects with full details
	 * @throws {Error} If the fetch request fails
	 */
	static async getDogs(dogIds: string[], config?: RequestConfig): Promise<Dog[]> {
		const response = await fetch(`${PUBLIC_API_URL}/dogs`, {
			method: 'POST',
			...getJsonConfig(config),
			body: JSON.stringify(dogIds)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to fetch dogs: ${errorText}`);
		}

		return response.json();
	}

	/**
	 * Generates a match from a list of dog IDs
	 * @param {string[]} dogIds - Array of dog IDs to consider for matching
	 * @param {RequestConfig} config - Optional request configuration
	 * @returns {Promise<{ match: string }>} Object containing the matched dog ID
	 * @throws {Error} If the match generation fails
	 */
	static async generateMatch(dogIds: string[], config?: RequestConfig): Promise<{ match: string }> {
		const response = await fetch(`${PUBLIC_API_URL}/dogs/match`, {
			method: 'POST',
			...getJsonConfig(config),
			body: JSON.stringify(dogIds)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Failed to generate match: ${errorText}`);
		}

		return response.json();
	}
}
