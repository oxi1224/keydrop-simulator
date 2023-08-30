import { invalidateAll } from '$app/navigation';
import type { ItemWithGlobal } from '$lib/types';
import type { Item } from '@prisma/client';

export async function sellItems(items: (Item | ItemWithGlobal)[]) {
  const IDs = items.map((i) => i.dropId);
  const res = await fetch('/api/skins/sell/', {
    method: 'POST',
    body: JSON.stringify({ itemIDs: IDs }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  await invalidateAll();

  return {
    res: res,
    messageKey: (await res.json()).messageKey
  };
}
