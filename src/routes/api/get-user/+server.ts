import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  if (!sessionId) return new Response(JSON.stringify({ data: null }), { status: 404 });
  const session = await db.session.findUnique({
    where: {
      id: sessionId
    }
  });
  if (!session) return new Response(JSON.stringify({ data: null }), { status: 404 });
  const user = await db.user.findUnique({
    where: {
      id: session.userId
    },
    include: {
      inventory: {
        orderBy: {
          dropDate: 'desc'
        }
      }
    }
  });
  if (!user) return new Response(JSON.stringify({ data: null }), { status: 404 });
  return new Response(
    JSON.stringify({
      data: {
        username: user.username,
        inventory: user.inventory,
        balance: user.balance,
        goldBalance: user.goldBalance,
        sandboxMode: user.sandboxMode
      }
    }),
    { status: 200 }
  );
}
