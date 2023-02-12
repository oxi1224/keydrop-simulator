import { db } from '$lib/server';
import type { Prisma } from '@prisma/client';
import type { RequestEvent } from '@sveltejs/kit';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET(event: RequestEvent) {
  const { order, rarity, searchString } = Object.fromEntries(event.url.searchParams);
  const page = parseInt(event.url.searchParams.get('page') ?? '');
  const minPrice = parseFloat(event.url.searchParams.get('minPrice') ?? '');
  const maxPrice = parseFloat(event.url.searchParams.get('maxPrice') ?? '');

  const items = await db.globalInventoryItem.findMany({
    skip: page * 15,
    take: 15,
    where: {
      skinPrice: {
        gt: minPrice,
        lt: maxPrice === 0 ? 999999 : maxPrice
      },
      skinRarity: rarity ?? undefined,
      skinName: {
        contains: searchString ?? undefined,
        mode: 'insensitive'
      }
    },
    orderBy: {
      skinPrice: order.toLowerCase() as Prisma.SortOrder
    }
  });
  const count = await db.globalInventoryItem.count({
    where: {
      skinPrice: {
        gt: minPrice,
        lt: maxPrice === 0 ? 999999 : maxPrice
      },
      skinRarity: rarity ?? undefined,
      skinName: {
        contains: searchString ?? undefined,
        mode: 'insensitive'
      }
    }
  });
  return new Response(JSON.stringify({ success: true, items: items, itemCount: count }), {
    status: 200
  });
}
