import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';
import { AuthService } from '$lib/services/auth';

export const actions = {
	default: async ({ cookies }) => {
		try {
			const authToken = cookies.get('fetch-access-token');
			// Attempt to logout through auth service
			await AuthService.logout({ authToken });
		} catch (error) {
			console.error('Logout error:', error);
		}

		// Always clear cookies, even if the API call fails
		cookies.delete('fetch-access-token', { path: '/' });
		cookies.delete('AWSALB', { path: '/' });
		cookies.delete('AWSALBCORS', { path: '/' });

		// Redirect to login page
		throw redirect(303, '/login');
	}
} satisfies Actions;
