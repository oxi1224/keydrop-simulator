import { getCaseData } from '$lib/server';
import type { LoadEvent } from '@sveltejs/kit';

/** @type {import('./$types').PageServerLoad} */
export async function load({ params }: { params: LoadEvent['params'] }) {
  return getCaseData(params.slug ?? '');
}
