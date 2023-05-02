import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }

  return {
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
