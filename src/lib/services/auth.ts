import { PUBLIC_API_URL } from '$env/static/public';
import type { LoginFormData } from '$lib/types/auth';

export class AuthService {
  static async login(formData: Partial<LoginFormData>) {
    const response = await fetch(`${PUBLIC_API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData),
      credentials: 'include'
    });

    return response;
  }

  static async logout() {
    return fetch(`${PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
  }

  static extractAuthToken(setCookieHeader: string): string | null {
    const cookieStrings = setCookieHeader.split(',').map(str => str.trim());
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