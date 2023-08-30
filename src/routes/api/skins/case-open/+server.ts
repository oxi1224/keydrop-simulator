import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';

interface RequestBody {
  count: number;
  websiteName: string;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { count, websiteName }: RequestBody = await event.request.json();
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

  if (count > 10)
    return new Response(JSON.stringify({ messageKey: '' }), {
      status: 404
    });

  const caseData = await db.case.findUnique({
    where: { websiteName: websiteName },
    include: {
      drops: {
        include: {
          globalInvItem: true
        }
      }
    }
  });

  if (!caseData)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.caseNotExists' }), {
      status: 404
    });

  if (user[caseData.goldenCase ? 'goldBalance' : 'balance'] < caseData.price * count)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.notEnoughBalance' }), {
      status: 404
    });

  const caseDrops = [];
  for (let i = 0; i < count; i++) {
    const rollNumber = randomInt(1, 100000);
    const drop = caseData?.drops.find(
      (obj) => obj.oddsRange[0] <= rollNumber && obj.oddsRange[1] >= rollNumber
    );
    if (!drop) {
      i--;
      continue;
    }
    caseDrops.push(drop);
  }

  const itemsToAdd = caseDrops.map((drop) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const globalItem = drop.globalInvItem;
    return {
      dropId: nanoid(),
      origin: caseData.websiteName,
      dropDate: new Date(),
      globalInvItem: {
        connect: {
          id: globalItem.id
        }
      }
    };
  });

  const addedItemsData = caseDrops.map((drop, i) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const globalItem = drop.globalInvItem;
    return {
      dropId: itemsToAdd[i].dropId,
      origin: caseData.websiteName,
      dropDate: itemsToAdd[i].dropDate,
      globalInvItem: globalItem,
      globalInvID: globalItem.id
    };
  });

  // prettier-ignore
  if (itemsToAdd.length !== count)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.errorDuringItemAdd' }), {
      status: 404 
    });

  await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        create: itemsToAdd
      },
      balance: caseData.goldenCase
        ? undefined
        : Math.round((user.balance - caseData.price * count + Number.EPSILON) * 100) / 100,
      goldBalance: !caseData.goldenCase
        ? undefined
        : Math.round((user.goldBalance - caseData.price * count + Number.EPSILON) * 100) / 100
    },
    include: {
      inventory: true
    }
  });

  return new Response(
    JSON.stringify({ messageKey: 'success', items: addedItemsData, caseDrops: caseDrops }),
    {
      status: 200
    }
  );
}
