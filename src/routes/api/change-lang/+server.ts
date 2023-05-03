import { TimeInMs } from '$lib';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const { lang }: { lang: 'en' | 'pl' } = await event.request.json();

  event.cookies.set('lang', lang, {
    path: '/',
    httpOnly: false,
    sameSite: 'strict',
    secure: true,
    maxAge: TimeInMs.Month / 1000
  });

  return new Response(JSON.stringify({ messageKey: 'success' }), {
    status: 200
  });
}
