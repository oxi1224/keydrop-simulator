// import type { UserItem } from '$lib';
import type { CaseDrop } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { Item } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { items, cost }: { items: CaseDrop[]; cost: number } = await event.request.json();
  if (!sessionId)
    return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ message: 'Użytkownik nie istnieje' }), { status: 404 });
  const itemsToAdd = items.map((i) => {
    const newObj: Omit<Item, 'ownerId'> = {
      dropId: nanoid(),
      skinName: i.skinName,
      skinPrice: i.dropDetails.price,
      skinWeapon: i.skinWeapon,
      skinImgSource: i.skinImgSource,
      skinRarity: i.skinRarity,
      skinQuality: i.dropDetails.quality
    };
    return newObj;
  });
  const updatedUser = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        create: itemsToAdd
      },
      balance: Math.round((user.balance - cost + Number.EPSILON) * 100) / 100
    }
  });
  return new Response(JSON.stringify({ message: 'Sukces', data: updatedUser }), { status: 200 });
}
