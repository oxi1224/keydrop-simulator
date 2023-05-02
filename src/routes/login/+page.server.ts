import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { TimeInMs, i18n } from '$lib';
import { get } from 'svelte/store';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
  return {
    currency: locals.lang === 'pl' ? 'pln' : 'eur',
    ...locals
  };
};

export const actions: Actions = {
  login: async (event) => {
    const lang = event.cookies.get('lang') as 'pl' | 'en';
    const langData = get(i18n)[lang];
    const data = await event.request.formData();
    const password = data.get('password')?.toString();
    const username = data.get('accountName')?.toString();

    if (!password || !username)
      return {
        success: false,
        message: langData.toasts.error.messages.noPasswordUsername
      };

    if (event.cookies.get('session_id'))
      return {
        success: false,
        message: langData.toasts.error.messages.loggedIn
      };

    const user = await db.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user || !bcrypt.compareSync(password, user.passwordHash))
      return {
        success: false,
        message: langData.toasts.error.messages.invalidPasswordUsername
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
      secure: false,
      maxAge: TimeInMs.Week / 1000
    });

    return {
      success: true,
      message: langData.toasts.success.messages.loginSuccess
    };
  },
  register: async (event) => {
    const lang = event.cookies.get('lang') as 'pl' | 'en';
    const langData = get(i18n)[lang];

    const data = await event.request.formData();
    const password = data.get('password')?.toString();
    const passwordConfirm = data.get('passwordConfirm')?.toString();
    const username = data.get('accountName')?.toString();
    const sandboxMode = data.get('sandboxMode') === 'on';
    const selectedLang = data.get('lang');

    if (!password || !passwordConfirm || !username || !selectedLang)
      return {
        success: false,
        message: langData.toasts.error.messages.invalidRegisterValue
      };

    if (event.cookies.get('session_id'))
      return {
        success: false,
        message: langData.toasts.error.messages.loggedIn
      };

    const isTaken = await db.user.findUnique({
      where: {
        username: username
      }
    });

    if (isTaken)
      return {
        success: false,
        message: langData.toasts.error.messages.usernameTaken
      };

    const hash = await bcrypt.hash(password, 15);
    const user = await db.user.create({
      data: {
        id: nanoid(),
        username: username,
        passwordHash: hash,
        balance: sandboxMode ? 999999999 : 50,
        sandboxMode: sandboxMode ?? false
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
      secure: false,
      maxAge: TimeInMs.Week / 1000
    });

    event.cookies.set('lang', selectedLang.toString(), {
      path: '/',
      httpOnly: false,
      sameSite: 'strict',
      secure: false,
      maxAge: TimeInMs.Month / 1000
    });

    return {
      success: true,
      message: langData.toasts.success.messages.registerSuccess
    };
  },
  logout: async (event) => {
    const lang = event.cookies.get('lang') as 'pl' | 'en';
    const langData = get(i18n)[lang];

    const sessionID = event.cookies.get('session_id');
    if (!sessionID)
      return {
        success: false,
        message: langData.toasts.error.messages.notLoggedIn
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
      message: langData.toasts.success.messages.logoutSuccess
    };
  }
};
