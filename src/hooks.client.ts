import { db } from '$lib/server';
import { parse } from 'cookie';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }: { event: any; resolve: any }) {
  const cookies = parse(event.headers.cookie || '');

  if (cookies.session_id) {
    const session = await db.session.findUnique({
      where: {
        id: cookies.session_id
      }
    });
    if (session) {
      const user = await db.session.findUnique({
        where: {
          id: session.userId
        }
      });
      event.locals.user = user;
      return resolve(event);
    }
  }

  event.locals.user = null;
  return resolve(event);
}

/** @type {import('@sveltejs/kit').GetSession} */
export function getSession(event: any) {
  return event?.locals?.user ? { user: event?.locals?.user } : {};
}
