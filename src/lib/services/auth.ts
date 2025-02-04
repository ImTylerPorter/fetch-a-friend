/**
 * Authentication service for the Fetch A Friend application.
 * Handles user authentication operations including login, logout, and token management.
 */

import { PUBLIC_API_URL } from '$env/static/public';
import type { LoginFormData } from '$lib/types/auth';

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

export class AuthService {
	/**
	 * Authenticates a user with the API
	 * @param {Partial<LoginFormData>} formData - User credentials including name and email
	 * @returns {Promise<Response>} The raw response from the auth endpoint
	 * @throws {Error} If the login request fails
	 */
	static async login(formData: Partial<LoginFormData>): Promise<Response> {
		const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
			method: 'POST',
			...getBaseConfig(),
			headers: {
				...getBaseConfig().headers,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(formData)
		});

		if (!response.ok) {
			const errorText = await response.text();
			console.error('Login failed:', {
				status: response.status,
				statusText: response.statusText,
				body: errorText
			});
			throw new Error(`Login failed: ${errorText}`);
		}

		return response;
	}

	/**
	 * Logs out the current user by invalidating their session
	 * @throws {Error} If the logout request fails
	 */
	static async logout(config?: RequestConfig): Promise<void> {
		const response = await fetch(`${PUBLIC_API_URL}/auth/logout`, {
			method: 'POST',
			...getBaseConfig(config)
		});

		if (!response.ok) {
			const errorText = await response.text();
			throw new Error(`Logout failed: ${errorText}`);
		}
	}

	/**
	 * Extracts the authentication token from a Set-Cookie header
	 * @param {string} setCookieHeader - The Set-Cookie header value from the server
	 * @returns {string | null} The extracted token or null if not found
	 */
	static extractAuthToken(setCookieHeader: string): string | null {
		const cookieStrings = setCookieHeader.split(',').map((str) => str.trim());
		for (const cookieStr of cookieStrings) {
			if (cookieStr.includes('fetch-access-token')) {
				const [cookie] = cookieStr.split(';');
				const [, token] = cookie.split('=');
				return token;
			}
		}
		return null;
	}
}
