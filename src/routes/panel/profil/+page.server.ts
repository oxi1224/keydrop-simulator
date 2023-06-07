import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db, userFromSessionID } from '$lib/server';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }
  const user = await userFromSessionID(cookies.get('session_id')!, true);
  return {
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    userInventory: user?.inventory ?? [],
    ...locals
  };
};


export const actions: Actions = {
  setBalance: async (event) => {
    const data = await event.request.formData();
    const balance = parseFloat(data.get('balanceAmount')?.toString() as string);
    const balanceType = data.get('balanceType')?.toString() as 'gold' | 'money';

    if (!balance || balance < 0 || balance > 999999999)
      return {
        success: false,
        messageKey: 'toasts.error.messages.invalidBalance'
      };
    
    if (!balanceType || !['gold', 'money'].includes(balanceType))
      return {
        success: false,
        messageKey: 'toasts.error.messages.invalidBalanceType'
      };

    const user = await userFromSessionID(event.cookies.get('session_id') ?? '');

    if (!user)
      return {
        success: false,
        messageKey: 'toasts.error.messages.notLoggedIn'
      };

    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        balance: balanceType === 'money' ? { set: balance } : undefined,
        goldBalance: balanceType === 'gold' ? { set: balance } : undefined,
      }
    });

    return {
      success: true,
      messageKey: 'success'
    };
  }
};
