import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const { lang }: { lang: string } = await event.request.json();

  const sessionId = event.cookies.get('session_id');
  if (!sessionId)
    return new Response(
      JSON.stringify({
        message: 'No session ID found.\nYou must be logged in to change the language.'
      }),
      {
        status: 404
      }
    );
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session)
    return new Response(JSON.stringify({ message: 'No session found' }), {
      status: 404
    });
  const user = await userFromSessionID(sessionId);

  if (!['pl', 'en'].includes(lang))
    return new Response(JSON.stringify({ message: 'Unknown language' }), {
      status: 404
    });

  if (!user)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.userNotExists' }), {
      status: 404
    });

  await db.user.update({
    where: {
      id: user.id
    },
    data: {
      language: lang
    }
  });

  return new Response(JSON.stringify({ messageKey: 'success' }), {
    status: 200
  });
}
