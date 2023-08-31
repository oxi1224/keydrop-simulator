import type { CaseBattle } from '$lib';
import { db, parseCaseBattle } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const joinKey: string | null = url.searchParams.get('joinKey');
  const battle: CaseBattle = (await db.caseBattle.findUnique({
    where: {
      id: parseInt(params.slug)
    }
  })) as any;
  if (
    !battle ||
    (!battle?.public && !joinKey && battle?.owner !== locals?.user.id) ||
    (battle?.joinKey !== joinKey && battle?.owner !== locals?.user.id)
  )
    throw redirect(300, '/case-battle/list');
  const parsedBattle = await parseCaseBattle(battle, true, false);
  return {
    battleData: parsedBattle,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
