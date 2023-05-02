import { db } from '$lib/server';
import type { Handle } from '@sveltejs/kit';
import { locale } from 'svelte-i18n';

export const handle: Handle = async ({ event, resolve }) => {
  const lang = event.cookies.get('lang');
  if (lang) {
    locale.set(lang);
    event.locals.lang = lang as 'pl' | 'en';
  }

  const sessionID = event.cookies.get('session_id');
  if (!sessionID) return await resolve(event);
  const session = await db.session.findUnique({
    where: {
      id: sessionID
    }
  });
  if (!session) return await resolve(event);

  const user = await db.user.findUnique({
    where: {
      id: session.userId
    },
    include: {
      inventory: true
    }
  });

  if (user) {
    event.locals.user = {
      id: user.id,
      username: user.username,
      inventory: user.inventory,
      balance: user.balance,
      goldBalance: user.goldBalance,
      sandboxMode: user.sandboxMode
    };
  }
  return await resolve(event);
};

// /** @type {import('@sveltejs/kit').Handle} */
// export async function handle({ event, resolve }: { event: any; resolve: any }) {
//   const cookies = parse(event.headers.cookie || '');
//   if (cookies.session_id) {
//     const user = await event.fetch('/api/get-user', { method: 'get', cache: 'no-cache' });
//     event.locals.user = user;
//     return resolve(event);
//   }
//   event.locals.user = null;
//   return resolve(event);
// }

// /** @type {import('@sveltejs/kit').GetSession} */
// export function getSession(event: any) {
//   return event?.locals?.user ? { user: event?.locals?.user } : {};
// }
