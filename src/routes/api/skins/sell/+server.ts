import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { itemID }: { itemID: string } = await event.request.json();

  if (!sessionId)
    return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ message: 'Użytkownik nie istnieje' }), { status: 404 });
  const item = user.inventory.find((obj) => (obj.dropId = itemID));
  if (!item)
    return new Response(JSON.stringify({ message: 'Użytkownik nie posiada danego przedmiotu' }), {
      status: 404
    });
  const updatedUser = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        delete: item
      },
      balance: {
        increment: Math.round((item.skinPrice + Number.EPSILON) * 100) / 100
      }
    }
  });
  return new Response(JSON.stringify({ message: 'Sukces', data: updatedUser }), { status: 200 });
}
