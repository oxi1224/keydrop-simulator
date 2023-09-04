import { TimeInMs } from '$lib';
import { db } from '$lib/server';
import { redirect, type Actions } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
  return {
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    userInventory: [],
    ...locals
  };
};

export const actions: Actions = {
  login: async (event) => {
    const data = await event.request.formData();
    const password = data.get('password')?.toString();
    const username = data.get('accountName')?.toString();

    if (!password || !username)
      return {
        success: false,
        messageKey: 'toasts.error.messages.noPasswordUsername'
      };

    if (event.locals.user)
      return {
        success: false,
        messageKey: 'toasts.error.messages.loggedIn'
      };

    const user = await db.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user || !bcrypt.compareSync(password, user.passwordHash))
      return {
        success: false,
        messageKey: 'toasts.error.messages.invalidPasswordUsername'
      };

    const session = await db.session.create({
      data: {
        id: nanoid(),
        userId: user.id
      }
    });

    event.cookies.set('session_id', session.id.toString(), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: TimeInMs.Week / 1000
    });

    return {
      success: true,
      messageKey: 'toasts.success.messages.loginSuccess'
    };
  },
  register: async (event) => {
    const data = await event.request.formData();
    const password = data.get('password')?.toString();
    const passwordConfirm = data.get('passwordConfirm')?.toString();
    const username = data.get('accountName')?.toString();
    const sandboxMode = data.get('sandboxMode') === 'on';
    const selectedLang = data.get('lang');

    if (!password || !passwordConfirm || !username || !selectedLang)
      return {
        success: false,
        messageKey: 'toasts.error.messages.invalidRegisterValue'
      };

    if (event.locals.user)
      return {
        success: false,
        messageKey: 'toasts.error.messages.loggedIn'
      };

    if (password !== passwordConfirm)
      return {
        success: false,
        messageKey: 'toasts.error.messages.passwordNotMatch'
      };

    const isTaken = await db.user.findUnique({
      where: {
        username: username
      }
    });

    if (isTaken)
      return {
        success: false,
        messageKey: 'toasts.error.messages.usernameTaken'
      };

    const hash = await bcrypt.hash(password, 15);
    const user = await db.user.create({
      data: {
        id: nanoid(),
        username: username,
        passwordHash: hash,
        balance: sandboxMode ? 999999999 : 50,
        sandboxMode: sandboxMode ?? false,
        language: selectedLang.toString()
      }
    });

    const session = await db.session.create({
      data: {
        id: nanoid(),
        userId: user.id
      }
    });

    event.cookies.set('session_id', session.id.toString(), {
      path: '/',
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
      maxAge: TimeInMs.Week / 1000
    });

    return {
      success: true,
      messageKey: 'toasts.success.messages.registerSuccess'
    };
  },
  logout: async (event) => {
    const sessionID = event.cookies.get('session_id');
    if (!sessionID)
      return {
        success: false,
        messageKey: 'toasts.error.messages.notLoggedIn'
      };

    await db.session
      .delete({
        where: {
          id: sessionID
        }
      })
      .catch(() => null);
    event.cookies.delete('session_id');

    return {
      success: true,
      messageKey: 'toasts.success.messages.logoutSuccess'
    };
  }
};
