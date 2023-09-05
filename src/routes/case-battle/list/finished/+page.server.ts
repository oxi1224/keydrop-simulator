import { db } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const battles = await db.caseBattle
    .findMany({
      where: {
        finished: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
    .catch(() => null);

  return {
    battles: battles,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
