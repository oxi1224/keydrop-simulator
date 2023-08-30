import type { CaseBattle } from '$lib';
import { db, parseCaseBattle } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  const joinKey: string | null = url.searchParams.get('joinKey');
  const battle = (await db.caseBattle.findUnique({
    where: {
      id: parseInt(params.slug)
    }
  })) as any as CaseBattle;
  if (!battle || (!battle?.public && !joinKey) || battle?.joinKey !== joinKey)
    throw redirect(300, '/case-battle/list');
  const parsedBattle = await parseCaseBattle(battle);

  return {
    battleData: parsedBattle,
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};
