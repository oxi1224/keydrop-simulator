import type { Item } from '@prisma/client';
import { createtoast } from '../toast';
import { setUserData } from '../stores';

export async function sellItems(items: Item[]) {
  const IDs = items.map((i) => i.dropId);
  const res = await fetch('/api/skins/sell/', {
    method: 'POST',
    body: JSON.stringify({ itemIDs: IDs }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  createtoast({
    type: res.ok ? 'success' : 'error',
    header: res.ok ? 'sukces' : 'błąd',
    message: (await res.json()).message
  });
  if (res.ok) setUserData();
  return res;
}
