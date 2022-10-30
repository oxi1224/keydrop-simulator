// import type { UserItem } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { Item } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { items, cost }: { items: Item[], cost: string | number } = await event.request.json();

  if (!sessionId) return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const user = await userFromSessionID(sessionId);
  if (!user) return new Response(JSON.stringify({ message: 'Użytkownik nie istnieje' }), { status: 404 });

  items.forEach(i => {
    i.dropId = nanoid();
    i.ownerId = user.id;
  });
  const finalInv = user.inventory.concat(items);
  const updatedUser = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        set: finalInv
      },
      balance: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        decrement: parseFloat(cost)
      }
    }
  });
  return new Response(JSON.stringify({ message: 'Sukces', data: updatedUser }), { status: 200 });
}
