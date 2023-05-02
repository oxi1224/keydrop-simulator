import { TimeInMs, i18n } from '$lib';
import type { RequestEvent } from '@sveltejs/kit';
import { get } from 'svelte/store';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const { lang }: { lang: 'en' | 'pl' } = await event.request.json();
  const langData = get(i18n)[lang];
  event.cookies.set('lang', lang, {
    path: '/',
    httpOnly: false,
    sameSite: 'strict',
    secure: false,
    maxAge: TimeInMs.Month / 1000
  });

  return new Response(JSON.stringify({ message: langData.success }), {
    status: 200
  });
}
