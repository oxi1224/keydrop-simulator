import type { Item } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { item }: { item: Item } = await event.request.json();
  if (!sessionId) return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const userInv = (await userFromSessionID(sessionId))?.inventory;
  if (!userInv) return new Response(JSON.stringify({ message: 'Użytkownik nie istnieje' }), { status: 404 });
  const filteredInv = userInv.filter(obj => JSON.stringify(obj) !== JSON.stringify(item));
  const user = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        set: filteredInv
      },
      balance: {
        increment: item.skinPrice
      }
    }
  });
  return new Response(JSON.stringify({ message: 'Sukces', data: user }), { status: 200 });
}
