import { userFromSessionID } from '$lib/server';
import type { Handle } from '@sveltejs/kit';
import { parse } from 'cookie';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
  const sessionID = event.cookies.get('session_id');
  if (!sessionID) return await resolve(event);

  const user = await userFromSessionID(sessionID);

  if (user) {
    event.locals.user = {
      id: user.id,
      username: user.username,
      inventory: user.inventory,
      balance: user.balance,
      goldBalance: user.goldBalance,
      sandboxMode: user.sandboxMode,
      language: user.language
    };
  }
  return await resolve(event);
};

// event.locals.lang = 'en';
// locale.set('en');

// const session = await db.session.findUnique({
//   where: {
//     id: sessionID
//   }
// });
// if (!session) return await resolve(event);

// const user = await db.user.findUnique({
//   where: {
//     id: session.userId
//   },
//   include: {
//     inventory: true
//   }
// });
