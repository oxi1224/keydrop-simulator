import { db } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const cases = await db.case.findMany({
    where: { goldenCase: false },
    orderBy: {
      section: {
        position: 'asc'
      }
    }
  });
  return {
    cases: cases,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
