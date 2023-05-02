import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ cookies, locals }) => {
  return {
    lang: cookies.get('lang') as 'pl' | 'en',
    user: locals.user
  };
};
