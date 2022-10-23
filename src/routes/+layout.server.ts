import { userData } from '$lib';
import { db } from '$lib/server';
import type { Cookies } from '@sveltejs/kit';

/** @type {import('./$types').LayoutServerLoad} */
export async function load({ cookies }: { cookies: Cookies }) {
  const sessionId = cookies.get('session_id');
  if (!sessionId) return userData.set(null);
  const session = await db.session.findUnique({
    where: {
      id: sessionId
    }
  });
  if (!session) return userData.set(null);
  const user = await db.user.findUnique({
    where: {
      id: session?.userId
    }
  });
  if (!user) return userData.set(null);
  userData.set({
    username: user.username,
    inventory: user.inventory,
    balance: user.balance,
    goldBalance: user.goldBalance,
    sandboxMode: user.sandboxMode
  });
}
