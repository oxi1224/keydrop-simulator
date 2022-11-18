import { getCaseData } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event: RequestEvent) {
  const data = await getCaseData(event.url.searchParams.get('caseName') ?? '');
  return new Response(JSON.stringify({ data: data }), { status: 200 });
}
