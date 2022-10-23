import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { serialize } from 'cookie';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');

  if (sessionId) {
    await db.session
      .delete({
        where: {
          id: sessionId
        }
      })
      .catch(() => null);
  }

  return new Response(JSON.stringify({ message: 'Pomyślne wylogowano' }), {
    status: 200,
    headers: {
      'Set-Cookie': serialize('session_id', '', {
        path: '/',
        expires: new Date(0)
      })
    }
  });
}
