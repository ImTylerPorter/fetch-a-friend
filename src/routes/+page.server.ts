/**
 * Root Page Server Module
 * Handles server-side logic for the main application page
 *
 * This module is responsible for:
 * - Loading and paginating dog data
 * - Managing search and filter functionality
 * - Handling authentication state
 * - Processing location-based searches
 * - Error handling and fallbacks
 */

import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthService } from '$lib/services/auth';
import { DogService } from '$lib/services/dogs';
import { LocationService } from '$lib/services/location';
import { getUniqueValues, isZipCode } from '$lib/utils/search';

interface LoginFormData {
  name: string;
  email: string;
}

/**
 * Form actions for the root page
 * Currently handles login functionality
 */
export const actions = {
  /**
   * Login action handler
   * Processes login form submissions and manages authentication
   *
   * @param {Object} params - Action parameters
   * @param {FormData} params.request - The form submission request
   * @returns {Promise<Object>} Success response or validation error
   * @throws {303} Redirects to home page on successful login
   */
  login: async ({ request }) => {
    const data = await request.formData();
    const formData: Partial<LoginFormData> = {
      name: data.get('name')?.toString(),
      email: data.get('email')?.toString()
    };

    if (!formData.name || !formData.email) {
      return fail(400, {
        error: 'Name and email are required',
        data: formData
      });
    }

    try {
      await AuthService.login(formData);
      throw redirect(303, '/');
    } catch (err) {
      if (err instanceof Response) throw err;

      console.error('Login error:', err);
      return fail(500, {
        error: 'An unexpected error occurred',
        data: formData
      });
    }
  }
} satisfies Actions;

/**
 * Server-side load function for the root page
 * Handles data loading, pagination, and search functionality
 *
 * Features:
 * - Authentication check
 * - Dog data pagination
 * - Search and filtering
 * - Location-based search with zip code fallback
 * - Error handling with graceful degradation
 *
 * @param {Object} params - Load function parameters
 * @param {Object} params.locals - Server locals containing auth state
 * @param {Object} params.cookies - Cookie store for auth token
 * @param {URL} params.url - Current URL for parsing search params
 * @returns {Promise<Object>} Page data including dogs, pagination, and filters
 * @throws {303} Redirects on invalid pagination
 */
export const load: PageServerLoad = async ({ locals, cookies, url }) => {
  if (!locals.isAuthenticated) {
    return {
      isAuthenticated: locals.isAuthenticated,
      dogs: [],
      total: 0,
      breeds: []
    };
  }

  try {
    const authToken = cookies.get('fetch-access-token');
    const size = 24; // Number of dogs per page

    // Get the requested page from URL (1-based for user)
    const requestedPage = Math.max(1, Number(url.searchParams.get('page') || '1'));
    // Calculate offset for API (convert to 0-based for calculations)
    const offset = (requestedPage - 1) * size;

    // Get search parameters
    const breed = url.searchParams.get('breed');
    const ageMin = url.searchParams.get('ageMin');
    const ageMax = url.searchParams.get('ageMax');
    const location = url.searchParams.get('location');
    const sort = url.searchParams.get('sort') || 'breed:asc';

    // Get list of breeds
    const breeds = await DogService.getBreeds({ authToken });

    // Get zip codes for location if provided
    let zipCodes: string[] | undefined;
    if (location) {
      try {
        const locations = await LocationService.searchLocations(location, { authToken });

        if (locations.length > 0) {
          // Extract unique zip codes
          zipCodes = getUniqueValues(locations.map((loc) => loc.zip_code));
        } else {
          // If no locations found, use the original input if it looks like a zip code
          if (isZipCode(location)) {
            zipCodes = [location];
          }
        }
      } catch (error) {
        console.error('Error searching locations:', error);
        // If search fails and input looks like a zip code, use it directly
        if (isZipCode(location)) {
          zipCodes = [location];
        }
      }
    }

    // Build search params
    const searchParams = {
      size,
      from: offset,
      sort: sort || 'breed:asc',
      ...(breed ? { breeds: [breed] } : {}),
      ...(zipCodes?.length ? { zipCodes } : {}),
      ...(ageMin ? { ageMin: Number(ageMin) } : {}),
      ...(ageMax ? { ageMax: Number(ageMax) } : {})
    };

    // Search for dogs with pagination
    const searchResult = await DogService.searchDogs(searchParams, { authToken });

    // Limit total to what we can actually paginate (416 pages * 24 per page = 9984 max results)
    const maxResults = 9984;
    const total = Math.min(searchResult.total, maxResults);
    const totalPages = 416; // Fixed number of pages we can actually access

    // If requested page is beyond total pages, redirect to last page
    if (requestedPage > totalPages) {
      const params = new URLSearchParams(url.searchParams);
      params.set('page', totalPages.toString());
      throw redirect(303, `/?${params.toString()}`);
    }

    // Fetch dogs for current page
    const dogs = await DogService.getDogs(searchResult.resultIds, { authToken });

    return {
      isAuthenticated: locals.isAuthenticated,
      dogs,
      total,
      currentPage: requestedPage,
      totalPages,
      breeds
    };
  } catch (error) {
    console.error('Error fetching dogs:', error);
    return {
      isAuthenticated: locals.isAuthenticated,
      dogs: [],
      total: 0,
      breeds: []
    };
  }
};
