import { getCaseData } from '$lib/server/db.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params, locals }) => {
  const caseData = await getCaseData(params.slug);
  return {
    caseData: caseData,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
