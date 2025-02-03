import { fail } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { AuthService } from '$lib/services/auth';
import type { LoginFormData } from '$lib/types/auth';

export const load: PageServerLoad = ({ locals }) => {
  return {
    isAuthenticated: locals.isAuthenticated
  };
};

export const actions = {
  default: async ({ request, cookies }) => {
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
      const response = await AuthService.login(formData);

      if (!response.ok) {
        const errorData = await response.json();
        return fail(response.status, {
          error: errorData.message || 'Authentication failed. Please try again.',
          data: formData
        });
      }

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