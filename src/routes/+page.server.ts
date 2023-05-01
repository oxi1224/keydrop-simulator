import { getCaseData } from "$lib/server";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async () => {
  const sections = await getCaseData('sections');
  return {
    sections: sections
  };
};
