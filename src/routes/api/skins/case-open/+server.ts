import type { CaseDrop, CaseWithDrops } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';

interface RequestBody {
  awardIDs: CaseDrop['id'][];
  caseData: CaseWithDrops;
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { awardIDs, caseData }: RequestBody = await event.request.json();
  if (!sessionId)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSessionID' }), {
      status: 404
    });
  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session)
    return new Response(JSON.stringify({ message: 'toasts.error.messages.noSession' }), {
      status: 404
    });
  const user = await userFromSessionID(sessionId);
  if (!user)
    return new Response(JSON.stringify({ message: 'toasts.error.messages.userNotExists' }), {
      status: 404
    });
  const itemsToAdd = [];
  for (const id of awardIDs) {
    await new Promise((r) => setTimeout(r, 1));
    const caseDrop = await db.caseDrop.findFirst({
      where: {
        id: id
      }
    });
    if (!caseDrop) continue;
    const globalItem = await db.globalInventoryItem.findFirst({
      where: {
        weaponName: caseDrop.weaponName,
        skinName: caseDrop.skinName,
        skinQuality: caseDrop.skinQuality,
        skinPrice: caseDrop.skinPrice
      }
    });
    if (!globalItem) continue;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id: _, ...globalItemData } = globalItem;
    itemsToAdd.push({
      dropId: nanoid(),
      origin: caseData.websiteName,
      dropDate: new Date(),
      ...globalItemData
    });
  }

  if (itemsToAdd.length !== awardIDs.length)
    return new Response(
      JSON.stringify({
        messageKey: 'toasts.error.messages.errorDuringItemAdd'
      }),
      {
        status: 404
      }
    );

  const updatedUser = await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        create: itemsToAdd
      },
      balance: caseData.goldenCase
        ? undefined
        : Math.round((user.balance - caseData.price * awardIDs.length + Number.EPSILON) * 100) /
          100,
      goldBalance: !caseData.goldenCase
        ? undefined
        : Math.round((user.goldBalance - caseData.price * awardIDs.length + Number.EPSILON) * 100) /
          100
    },
    include: {
      inventory: true
    }
  });
  return new Response(
    JSON.stringify({ messageKey: 'success', data: updatedUser, items: itemsToAdd }),
    {
      status: 200
    }
  );
}
