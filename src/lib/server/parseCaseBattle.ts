import type { CaseBattle, CaseDropWithGlobal, ParsedCaseBattle } from '$lib/types';
import { db } from './db';

export async function parseCaseBattle(
  battle: CaseBattle,
  parseDrops: boolean,
  parseWonItems: boolean
): Promise<ParsedCaseBattle> {
  const parsedBattle: ParsedCaseBattle = battle as any;

  if (parseDrops) {
    for (let i = 0; i < battle.playerCount; i++) {
      const parsedItems: CaseDropWithGlobal[][] = [];
      const battleCaseDrops: string[][] = battle.drops![i] as any;
      for (const IDs of battleCaseDrops) {
        const items = await db.$transaction(
          IDs.map((id) =>
            db.caseDrop.findFirst({
              where: { id: id },
              include: { globalInvItem: true }
            })
          )
        );
        parsedItems.push(items as any as CaseDropWithGlobal[]);
      }
      parsedBattle.drops[i] = parsedItems;
    }
  } else if (parseWonItems) {
    for (let i = 0; i < battle.playerCount; i++) {
      const IDs: string[] = battle.wonItems[i];
      const items: CaseDropWithGlobal[] = await db.$transaction(
        IDs.map((id) =>
          db.caseDrop.findFirst({
            where: { id: id },
            include: { globalInvItem: true }
          })
        )
      ) as any;
      parsedBattle.wonItems[i] = items;
    }
  }
  return parsedBattle;
}
