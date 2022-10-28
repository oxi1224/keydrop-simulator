import type { UserData } from '$lib';
import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event: RequestEvent) {
  let data: null | UserData;
  const sessionId = event.cookies.get('session_id');
  if (!sessionId) {
    data = null;
    return new Response(null, { status: 204 });
  }
  const session = await db.session.findUnique({
    where: {
      id: sessionId
    }
  });
  if (!session) {
    data = null;
    return new Response(null, { status: 204 });
  }
  const user = await db.user.findUnique({
    where: {
      id: session?.userId
    }
  });
  if (!user) {
    data = null;
    return new Response(null, { status: 204 });
  }
  data = {
    username: user.username,
    inventory: user.inventory,
    balance: user.balance,
    goldBalance: user.goldBalance,
    sandboxMode: user.sandboxMode
  };
  return new Response(JSON.stringify({ data: data }), { status: 200 });
}
