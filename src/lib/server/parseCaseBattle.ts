import type { CaseBattle, CaseDropWithGlobal, ParsedCaseBattle } from '$lib/types';
import { db } from './db';

export async function parseCaseBattle(battle: CaseBattle): Promise<ParsedCaseBattle> {
  const parsedBattle: ParsedCaseBattle = battle as any;
  for (let i = 0; i < battle.playerCount; i++) {
    const battleCaseDrops = battle.drops![i] as any;
    const parsedBattleDrops: CaseDropWithGlobal[][] = [];
    for (const IDs of battleCaseDrops) {
      const parsedItems: CaseDropWithGlobal[] = [];
      for (const id of IDs) {
        const itemData = await db.caseDrop.findUnique({
          where: {
            id: id as string
          },
          include: {
            globalInvItem: true
          }
        });
        if (itemData) parsedItems.push(itemData as CaseDropWithGlobal);
      }
      parsedBattleDrops.push(parsedItems);
    }
    parsedBattle.drops[i] = parsedBattleDrops;
  }
  return parsedBattle;
}
