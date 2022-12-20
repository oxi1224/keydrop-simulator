import type { CaseDrop } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

interface RequestBody {
  items: CaseDrop[];
  cost: number;
  origin: string;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { items, cost, origin }: RequestBody = await event.request.json();
  if (!sessionId)
    return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ message: 'Użytkownik nie istnieje' }), { status: 404 });
  const itemsToAdd = [];
  for (const i of items) {
    // This is to avoid the same date
    const globalItem = await db.globalInventoryItem.findFirst({
      where: {
        weaponName: i.weaponName,
        skinName: i.skinName,
        skinQuality: i.skinQuality,
        skinPrice: i.skinPrice
      }
    });
    if (!globalItem) continue;
    await new Promise((r) => setTimeout(r, 1));
    itemsToAdd.push({
      dropId: nanoid(),
      origin: origin,
      dropDate: new Date(),
      ...globalItem
    });
  }
  const updatedUser = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        create: itemsToAdd
      },
      balance: Math.round((user.balance - cost + Number.EPSILON) * 100) / 100
    },
    include: {
      inventory: true
    }
  });
  return new Response(JSON.stringify({ message: 'Sukces', data: updatedUser, items: itemsToAdd }), {
    status: 200
  });
}
