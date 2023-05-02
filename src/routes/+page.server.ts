import { getCaseData } from '$lib/server';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  const sections = await getCaseData('sections');
  return {
    sections: sections,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
