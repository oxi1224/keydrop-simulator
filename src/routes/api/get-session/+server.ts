import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event: RequestEvent) {
  const data = await db.session.findUnique({
    where: {
      id: event.url.searchParams.get('sessionId') ?? ''
    }
  });
  return new Response(JSON.stringify({ data: data }), { status: 200 });
}
