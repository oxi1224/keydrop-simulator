import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { userFromSessionID } from '$lib/server';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }
  const user = await userFromSessionID(cookies.get('session_id')!, true);
  return {
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    userInventory: user?.inventory ?? [],
    ...locals
  };
};
