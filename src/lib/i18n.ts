import { init, register } from 'svelte-i18n';
import { writable } from 'svelte/store';
import en from '$assets/locale/en.json';
import pl from '$assets/locale/pl.json';

const defaultLocale = 'en';

register('en', () => import('$assets/locale/en.json'));
register('pl', () => import('$assets/locale/pl.json'));

init({
  fallbackLocale: defaultLocale,
  initialLocale: defaultLocale
});

export const i18n = writable({ en, pl });
