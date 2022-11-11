import { createPopup } from '../popup';
import { setUserData } from '../stores';

export async function massSellSkins(IDs: string[]) {
  const res = await fetch('/api/skins/mass-sell/', {
    method: 'POST',
    body: JSON.stringify({ itemIDs: IDs }),
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
