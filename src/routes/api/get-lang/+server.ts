import type { RequestEvent } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { TimeInMs } from '$lib';

export const GET: RequestHandler = async (event: RequestEvent) => {
  const lang = event.cookies.get('lang');

  event.cookies.set('lang', lang ?? 'en', {
    path: '/',
    httpOnly: false,
    sameSite: 'strict',
    secure: true,
    maxAge: TimeInMs.Month / 1000
  });

  return new Response(
    JSON.stringify({
      data: {
        lang: lang ?? 'en'
      }
    }),
    { status: 200 }
  );
};
