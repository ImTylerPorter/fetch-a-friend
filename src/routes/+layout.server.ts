import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ locals }) => {
  console.log(locals)
  return {
    isAuthenticated: locals.isAuthenticated
  };
};