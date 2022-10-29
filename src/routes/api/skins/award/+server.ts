import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { item, cost } = await event.request.json();
  if (!sessionId) return new Response(JSON.stringify({ message: 'Brak ID sesji' }), { status: 404 });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session) return new Response(JSON.stringify({ message: 'Brak sesji' }), { status: 404 });
  const user = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        push: {
          ...item,
          dropId: nanoid()
        }
      },
      balance: {
        increment: parseFloat(cost)
      }
    }
  });
  return new Response(JSON.stringify({ message: 'Sukces', data: user }), { status: 200 });
}
