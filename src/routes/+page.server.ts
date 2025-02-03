import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

interface LoginFormData {
  name: string;
  email: string;
}

export const actions = {
  login: async ({ request, fetch }) => {
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
      const response = await fetch(`${import.meta.env.PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
      });

      if (!response.ok) {
        return fail(response.status, {
          error: 'Login failed. Please check your credentials.',
          data: formData
        });
      }

      throw redirect(303, '/search');
    } catch (err) {
      if (err instanceof Response) throw err;

      return fail(500, {
        error: 'An unexpected error occurred',
        data: formData
      });
    }
  }
} satisfies Actions;