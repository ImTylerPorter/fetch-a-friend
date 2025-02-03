import { redirect, type Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  // Check if the user is authenticated by looking for the fetch-access-token
  const authToken = event.cookies.get('fetch-access-token');
  const isAuthenticated = !!authToken && authToken.includes('eyJ'); // Basic JWT validation

  // Add auth info to event.locals
  event.locals.isAuthenticated = isAuthenticated;

  // Protected routes that require authentication
  if (!isAuthenticated && !event.url.pathname.startsWith('/login')) {
    throw redirect(303, '/login');
  }

  // Public routes that should not be accessible when authenticated
  if (isAuthenticated && event.url.pathname === '/login') {
    throw redirect(303, '/');
  }

  const response = await resolve(event);
  return response;
};