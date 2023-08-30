import { db, userFromSessionID } from '$lib/server';
import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, cookies }) => {
  if (!locals.user) {
    throw redirect(302, '/');
  }
  const user = await userFromSessionID(cookies.get('session_id')!, true);
  return {
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    userInventory: user!.inventory,
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

    const balanceMulti = event.locals.lang === 'pl' ? 1 : 5;
    await db.user.update({
      where: {
        id: user.id
      },
      data: {
        balance: balanceType === 'money' ? { set: balance * balanceMulti } : undefined,
        goldBalance: balanceType === 'gold' ? { set: balance } : undefined
      }
    });

    return {
      success: true,
      messageKey: 'success'
    };
  },
  setProfilePic: async (event) => {
    const data = await event.request.formData();
    const url = data.get('url')?.toString();

    if (!url || !/(http)?s?:?(\/\/[^"']*\.(?:png|jpg|jpeg|png|webp))/i.test(url))
      return {
        success: false,
        messageKey: 'toasts.error.messages.invalidUrl'
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
        pfpUrl: url
      }
    });

    // TODO changing pfp
    // regex + below
    // await fetch(url).then((res) => res.headers['content-type'].startsWith('image'))
    // https://stackoverflow.com/questions/9714525/javascript-image-url-verify

    return {
      success: true,
      messageKey: 'success'
    };
  }
};
