import type { ItemWithGlobal } from '$lib';
import { db, userFromSessionID } from '$lib/server';
import type { GlobalInventoryItem } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';
import { randomInt } from 'crypto';
import { nanoid } from 'nanoid';

interface RequestBody {
  selectedItems: ItemWithGlobal[];
  goalItems: GlobalInventoryItem[];
  addedBalance: number;
  position: 'TOP' | 'BOT';
  mode: 'TRIANGLE' | 'CIRCLE';
}

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const sessionId = event.cookies.get('session_id');
  const { selectedItems, goalItems, addedBalance, position, mode }: RequestBody =
    await event.request.json();
  if (!sessionId)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSessionID' }), {
      status: 404
    });

  const session = await db.session.findUnique({ where: { id: sessionId } });
  if (!session)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.noSession' }), {
      status: 404
    });

  const user = await userFromSessionID(sessionId, true);

  if (!user)
    return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.userNotExists' }), {
      status: 404
    });

  for (const sItem of selectedItems) {
    const item = user.inventory?.find((i) => i.dropId === sItem.dropId);
    if (item?.sold || item?.upgraded)
      return new Response(JSON.stringify({ messageKey: 'toasts.error.messages.itemNotFound' }), {
        status: 404
      });
  }

  if (
    !selectedItems ||
    !goalItems ||
    addedBalance < 0 ||
    !isFinite(addedBalance) ||
    isNaN(addedBalance) ||
    mode === 'CIRCLE'
  )
    return new Response(
      JSON.stringify({ messageKey: 'toasts.error.messages.upgraderInvalidValues' }),
      {
        status: 400
      }
    );

  const totalGoalValue = goalItems.reduce((total, item) => (total += item.skinPrice), 0);
  const totalSelectedValue =
    selectedItems.reduce((total, item) => (total += item.globalInvItem.skinPrice), 0) +
    addedBalance;
  const successChance =
    Math.round((100 / (totalGoalValue / totalSelectedValue)) * 0.9 + Number.EPSILON * 100) / 100;

  if (!successChance || successChance > 81 || successChance < 0)
    return new Response(
      JSON.stringify({ messageKey: 'toasts.error.messages.upgraderInvalidChance' }),
      {
        status: 400
      }
    );

  const zeroOffset = position === 'TOP' ? 0 : 180;
  const randomDegree = randomInt(0, 360);
  const start = 0;
  const end = Math.round(360 * successChance);
  const rotation = 360 * 5 + randomDegree;
  const rotationOffset = randomDegree + zeroOffset;
  let success: boolean;

  // if (mode === 'TRIANGLE') {
  const normalizedPointer = ((rotationOffset % 360) + 360) % 360;
  const normalizedAreaStart = ((start % 360) + 360) % 360;
  const normalizedAreaEnd = ((end % 360) + 360) % 360;

  if (normalizedAreaStart <= normalizedAreaEnd) {
    success = normalizedPointer >= normalizedAreaStart && normalizedPointer <= normalizedAreaEnd;
  } else {
    success = normalizedPointer >= normalizedAreaStart || normalizedPointer <= normalizedAreaEnd;
  }
  // } else {
  //   const totalRotations = ((start + rotationOffset) / 360);
  //   end += totalRotations * 360;
  //   success = end + rotationOffset >= 360;
  //   rotation += position === 'TOP' ? -90 : 90;
  // }

  const itemsToAdd = [];
  if (success) {
    for (const globalItem of goalItems) {
      itemsToAdd.push({
        dropId: nanoid(),
        origin: 'UPGRADER',
        dropDate: new Date(),
        globalInvItem: {
          connect: {
            id: globalItem.id
          }
        }
      });
    }
  }

  const itemsToUpdate = selectedItems.map((i) => {
    return {
      where: {
        dropId: i.dropId
      },
      data: {
        upgraded: true
      }
    };
  });

  await db.user.update({
    where: {
      id: session.userId
    },
    data: {
      inventory: {
        create: itemsToAdd,
        update: itemsToUpdate
      },
      balance: {
        decrement: addedBalance > 0 && addedBalance ? addedBalance : 0
      }
    },
    include: {
      inventory: true
    }
  });

  return new Response(
    JSON.stringify({ messageKey: 'success', success: success, rotation: rotation }),
    {
      status: 200
    }
  );
}
