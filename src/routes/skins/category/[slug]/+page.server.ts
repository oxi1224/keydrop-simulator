import { getCaseData } from '$lib/server/db.js';
import type { PageServerLoad } from './$types.js';

export const load: PageServerLoad = async ({ params }) => {
  const caseData = await getCaseData(params.slug);
  return {
    caseData: caseData
  };
};