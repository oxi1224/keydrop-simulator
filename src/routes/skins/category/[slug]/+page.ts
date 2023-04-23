/** @type {import('./$types').PageLoad} */
export async function load(PageLoadEvent) {
  const caseData = await PageLoadEvent.fetch(`/api/get-case?caseName=${PageLoadEvent.params.slug}`, {
    method: 'GET'
  }).then(async (res) => (await res.json()).data);
  return {
    caseData: caseData
  };
}
