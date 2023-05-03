import type { Item } from '@prisma/client';
import { invalidateAll } from '$app/navigation';

export async function sellItems(items: Item[]) {
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
