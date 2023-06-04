import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
  return {
    lang: locals.lang as 'pl' | 'en',
    user: locals.user,
  };
};
