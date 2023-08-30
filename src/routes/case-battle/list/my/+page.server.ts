import { db } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const battles = await db.caseBattle.findMany({
    where: {
      OR: [
        {
          players: {
            path: ['0', 'id'],
            string_contains: locals.user?.id
          }
        },
        {
          players: {
            path: ['1', 'id'],
            string_contains: locals.user?.id
          }
        },
        {
          players: {
            path: ['2', 'id'],
            string_contains: locals.user?.id
          }
        },
        {
          players: {
            path: ['3', 'id'],
            string_contains: locals.user?.id
          }
        }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return {
    battles: battles,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
