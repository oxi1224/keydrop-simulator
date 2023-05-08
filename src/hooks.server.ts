import { TimeInMs } from '$lib';
import { userFromSessionID } from '$lib/server';
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
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
      language: user.language
    };
  }
  return await resolve(event);
};
