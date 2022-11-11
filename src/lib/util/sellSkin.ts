import type { Item } from '@prisma/client';
import { createPopup } from '../popup';
import { setUserData } from '../stores';

export async function sellSkin(skin: Item) {
  const ID = skin.dropId;
  const res = await fetch('/api/skins/mass-sell/', {
    method: 'POST',
    body: JSON.stringify({ itemIDs: [ID] }),
    headers: {
      'Content-Type': 'application/json'
    }
  });
  createPopup({
    type: res.ok ? 'success' : 'error',
    header: res.ok ? 'sukces' : 'błąd',
    message: (await res.json()).message
  });
  if (res.ok) setUserData();
  return res;
}
