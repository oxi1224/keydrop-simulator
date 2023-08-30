import { browser } from '$app/environment';
import '$lib/i18n.js';
import { locale, waitLocale } from 'svelte-i18n';
import type { LayoutLoad } from './$types';

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
