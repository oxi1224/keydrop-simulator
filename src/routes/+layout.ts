import type { LayoutLoad } from './$types';
import { browser } from '$app/environment';
import { locale, waitLocale } from 'svelte-i18n';
import '$lib/i18n.js';

export const load: LayoutLoad = async ({ data }) => {
  if (browser) {
    locale.set(data.lang);
  }
  await waitLocale();

  return {
    currency: data.lang === 'pl' ? 'pln' : 'eur',
    ...data
  };
};
