/** @type {import('./$types').PageLoad} */
export async function load(PageLoadEvent) {
  const sections = await PageLoadEvent.fetch('/api/get-case?caseName=sections', {
    method: 'GET'
  }).then(async (res) => (await res.json()).data);
  return {
    sections: sections
  };
}
