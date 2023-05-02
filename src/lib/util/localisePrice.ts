import type { Page } from '@sveltejs/kit';
import { get, type Readable } from 'svelte/store';

export function localisePrice(
  pageStore: Readable<Page<Record<string, string>, string | null>>,
  number: number
) {
  const pageData = get(pageStore);
  return (pageData.data.currency === 'eur' ? number / 5 : number)?.toFixed(2) ?? NaN;
}
