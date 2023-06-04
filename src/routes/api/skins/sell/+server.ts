import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { itemIDs }: { itemIDs: string[] } = await event.request.json();

  if (!sessionId)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSessionID' }), {
      status: 404
    });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSession' }), {
      status: 404
    });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.userNotExists' }), {
      status: 404
    });

  const items = await db.item.findMany({
    where: {
      dropId: { in: itemIDs },
      ownerId: user.id,
      sold: false,
      upgraded: false
    },
    include: {
      globalInvItem: true
    }
  });

  if (!items.length)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.itemNotFound' }), {
      status: 404
    });

  const priceSum = items.reduce((n, o) => n + o.globalInvItem.skinPrice, 0);
  const balanceToAdd = Math.round((priceSum + Number.EPSILON) * 100) / 100;

  await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        updateMany: {
          where: {
            dropId: { in: items.map((i) => i.dropId) }
          },
          data: { sold: true }
        }
      },
      balance: {
        increment: balanceToAdd
      },
      goldBalance: {
        increment: Math.round(balanceToAdd * 2.5)
      }
    }
  });
  return new Response(JSON.stringify({ messageKey: 'toasts.success.messages.sell' }), {
    status: 200
  });
}
