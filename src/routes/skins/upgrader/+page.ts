import type { PageLoad } from './$types';

// TODO type this properly
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const load: PageLoad = async ({ fetch, data }) => {
  const availableItems = await fetch(
    '/api/skins/get-items?' +
      new URLSearchParams({
        page: '0',
        order: 'DESC',
        minPrice: '0',
        maxPrice: '0'
      }),
    { method: 'GET' }
  )
    .then(async (res) => await res.json())
    .then((d) => d.items || []);

  return {
    availableItems,
    ...data
  };
};
