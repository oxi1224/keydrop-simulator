import { db, userFromSessionID } from '$lib/server';
import type { Item } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { itemIDs }: { itemIDs: string[] } = await event.request.json();

  if (!sessionId)
    return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ message: 'Użytkownik nie istnieje' }), { status: 404 });
  const items: Item[] = [];
  itemIDs.forEach((ID) => {
    const item = user.inventory.find((obj) => obj.dropId === ID && !obj.sold);
    if (item) items.push(item);
  });
  if (items.length !== itemIDs.length)
    return new Response(
      JSON.stringify({ message: 'Użytkownik nie posiada jednego lub paru przedmiotów z listy' }),
      {
        status: 404
      }
    );
  const priceSum = items.reduce((n, o) => n + o.skinPrice, 0);
  const queries = items.map((i) => {
    return {
      where: { dropId: i.dropId },
      data: { sold: true }
    };
  });
  const updatedUser = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        updateMany: queries
      },
      balance: {
        increment: Math.round((priceSum + Number.EPSILON) * 100) / 100
      }
    }
  });
  return new Response(JSON.stringify({ message: 'Pomyślnie sprzedano', data: updatedUser }), {
    status: 200
  });
}
