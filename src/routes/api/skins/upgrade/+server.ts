import { db, userFromSessionID } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import { nanoid } from 'nanoid';
import { randomInt } from 'crypto';
import type { ItemWithGlobal } from '$lib';
import type { GlobalInventoryItem } from '@prisma/client';

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
    mode === 'CIRCLE' ||
    position === 'BOT'
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

  // const arr = new Uint32Array(1);
  // crypto.getRandomValues(arr);
  // const mantissa = arr[0] * Math.pow(2, 20) + (arr[1] >>> 12);
  // const randomNumber = mantissa * Math.pow(2, -52);

  // const areaStartDegree = position === 'TOP' ? 0 : 180;
  // const successDecimal = successChance / 100;
  // const success = randomNumber < successDecimal;
  // let rotationOffset = areaStartDegree + (randomNumber * (360 - areaStartDegree));
  // rotationOffset %= 360;

  // const rotation = 360 * 5 + rotationOffset;
  // const offsetMin = position === 'TOP' ? 0 : -360;
  // const offsetMax = position === 'TOP' ? 360 : 0;
  const min = 0;
  const max = Math.round(360 * successChance);
  const rotationOffset = randomInt(0, 360);
  const rotation = 360 * 5 + rotationOffset;

  const success = rotationOffset - 180 >= min && rotationOffset <= max - 180;
  // console.log(offsetMin, offsetMax, rotationOffset, min, max);
  // if (mode === 'CIRCLE') {
  //   const fullCircle = 360;

  //   const startDegree = (min + rotationOffset) % fullCircle;
  //   const endDegree = (max + rotationOffset) % fullCircle;

  //   if (startDegree <= endDegree) success = startDegree <= 0 && endDegree >= 0;
  //   else success = startDegree <= 0 || endDegree >= 0 || endDegree - startDegree >= fullCircle;
  // }
  // else success = rotationOffset >= min && rotationOffset <= max;
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
