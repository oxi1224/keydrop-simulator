import type { CaseBattle, CaseDrop, ParsedCaseBattle } from '$lib/types';
import { db } from './db';

export async function parseCaseBattle(
  battle: CaseBattle,
  parseDrops: boolean,
  parseWonItems: boolean
): Promise<ParsedCaseBattle> {
  const parsedBattle: ParsedCaseBattle = battle as any;

  if (parseDrops) {
    const memo: Map<string, CaseDrop> = new Map();
    for (let i = 0; i < battle.playerCount; i++) {
      const parsedItems: CaseDrop[][] = [];
      const battleCaseDrops: string[][] = battle.drops![i] as any;
      for (const IDs of battleCaseDrops) {
        const items: CaseDrop[] = [];
        for (const id of IDs) {
          if (memo.has(id)) {
            items.push(memo.get(id)!);
          } else {
            const item: CaseDrop = (await db.caseDrop.findFirst({
              where: { id: id }
            })) as any;
            memo.set(id, item);
            items.push(item);
          }
        }
        parsedItems.push(items as any as CaseDrop[]);
      }
      parsedBattle.drops[i] = parsedItems;
    }
    memo.clear();
  } else if (parseWonItems) {
    for (let i = 0; i < battle.playerCount; i++) {
      const IDs: string[] = battle.wonItems[i];
      const items: CaseDrop[] = (await db.$transaction(
        IDs.map((id) =>
          db.caseDrop.findFirst({
            where: { id: id }
          })
        )
      )) as any;
      parsedBattle.wonItems[i] = items;
    }
  }
  return parsedBattle;
}
