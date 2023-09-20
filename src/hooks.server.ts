import { TimeInMs } from '$lib';
import { userFromSessionID } from '$lib/server';
import type { Handle } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { locale } from 'svelte-i18n';

const auth: Handle = async ({ event, resolve }) => {
  const sessionID = event.cookies.get('session_id');
  if (!sessionID) return await resolve(event);
  const user = await userFromSessionID(sessionID);
  if (user) {
    event.locals.user = {
      id: user.id,
      username: user.username,
      balance: user.balance,
      goldBalance: user.goldBalance,
      sandboxMode: user.sandboxMode,
      language: user.language,
      pfpUrl: user.pfpUrl
    };
  }
  return await resolve(event);
};

const i18n: Handle = async ({ event, resolve }) => {
  const lang = event.cookies.get('lang');

  if (lang) {
    locale.set(lang);
    event.locals.lang = lang as 'pl' | 'en';
  } else {
    event.cookies.set('lang', 'en', {
      path: '/',
      httpOnly: false,
      sameSite: 'strict',
      secure: true,
      maxAge: TimeInMs.Month / 1000
    });
  }

  return await resolve(event, {
    transformPageChunk: ({ html }) => html.replace('%lang%', lang ?? 'en')
  });
};

export const handle = sequence(auth, i18n);
