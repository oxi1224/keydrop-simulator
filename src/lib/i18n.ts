import { init, register } from 'svelte-i18n';

register('en', () => import('$assets/locale/en.json'));
register('pl', () => import('$assets/locale/pl.json'));

init({
  fallbackLocale: 'en',
  initialLocale: 'en'
});
