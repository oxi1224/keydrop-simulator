import type { CaseBattleDropData, CaseBattleWonItems, CaseWithDrops } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';

const WINNING_ITEM = 35;

interface RequestBody {
  cases: { caseName: string; count: number }[];
  playerCount: 2 | 3 | 4;
  publicMode: 'public' | 'private';
  mode: 'classic' | 'underdog';
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { cases, playerCount, publicMode, mode }: RequestBody = await event.request.json();
  if (!sessionId)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSessionID' }), {
      status: 404
    });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSession' }), {
      status: 404
    });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.userNotExists' }), {
      status: 404
    });

  const hasActiveBattles = await db.caseBattle.findFirst({
    where: {
      owner: user.id,
      finished: false
    }
  });

  if (hasActiveBattles)
    return new Response(
      JSON.stringify({ messageKey: 'toasts.error.messages.battleLimitReached' }),
      {
        status: 403
      }
    );

  const totalCaseCount = cases.reduce((t, c) => (t += c.count), 0);
  if (totalCaseCount > 20 || !cases || !playerCount || !publicMode || !mode)
    return new Response(JSON.stringify({ messageKey: '' }), {
      status: 400
    });

  const caseData: (CaseWithDrops & { count: number })[] = [];
  for (const c of cases) {
    const data = await db.case.findUnique({
      where: {
        urlName: c.caseName
      },
      include: {
        drops: true
      }
    });

    caseData.push({
      ...(data as CaseWithDrops)!,
      count: c.count
    });
  }

  if (caseData.reduce((t, c) => (t += c.count), 0) !== totalCaseCount)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.caseNotExists' }), {
      status: 400
    });

  const caseBattleDrops: CaseBattleDropData = {};
  const wonItems: CaseBattleWonItems = {};
  for (let i = 0; i < playerCount; i++) {
    const caseDrops: string[][] = [];
    for (const cData of caseData) {
      for (let j = 0; j < cData.count; j++) {
        const caseRollItemIDs: string[] = [];
        for (let itemI = 0; itemI < 36; itemI++) {
          const rollNumber = randomInt(1, 100000);
          const item = cData.drops.find(
            (obj) => obj.oddsRange[0] <= rollNumber && obj.oddsRange[1] >= rollNumber
          );
          if (!item) {
            itemI -= 1;
            continue;
          }
          caseRollItemIDs.push(item.id);
        }
        caseDrops.push(caseRollItemIDs);
      }
    }
    wonItems[i] = caseDrops.map((drops) => drops[WINNING_ITEM]).flat();
    caseBattleDrops[i] = caseDrops;
  }

  const totalCasePrice = caseData.reduce((t, c) => (t += c.price * c.count), 0);
  if (user.balance < totalCasePrice)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.notEnoughBalance' }), {
      status: 400
    });

  let joinKey;
  if (publicMode === 'private') joinKey = nanoid();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { passwordHash, ...userWithoutHash } = user;
  const battle = await db.caseBattle.create({
    data: {
      owner: user.id,
      totalPrice: totalCasePrice,
      totalCases: totalCaseCount,
      players: { 0: { ...userWithoutHash, bot: false } } as any,
      playerCount: playerCount,
      caseData: caseData.map((c) => ({
        websiteName: c.websiteName,
        urlName: c.urlName,
        imgName: c.imgName,
        count: c.count
      })),
      drops: caseBattleDrops as any,
      wonItems: wonItems as any,
      public: publicMode === 'public',
      joinKey: joinKey,
      mode: mode
    }
  });

  return new Response(
    JSON.stringify({
      messageKey: 'success',
      battleID: battle.id,
      redirectTo: `/case-battle/battle/${battle.id}${joinKey ? '?joinKey=' + joinKey : ''}`
    }),
    {
      status: 200
    }
  );
}
