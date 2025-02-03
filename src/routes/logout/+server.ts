import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { AuthService } from '$lib/services/auth';

export const POST: RequestHandler = async ({ cookies }) => {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error('Logout error:', error);
  }

  // Always clear the cookies, even if the API call fails
  cookies.delete('fetch-access-token', { path: '/' });
  cookies.delete('AWSALB', { path: '/' });
  cookies.delete('AWSALBCORS', { path: '/' });

  // Redirect to login page
  throw redirect(303, '/login');
};