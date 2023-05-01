import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { db } from '$lib/server';
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import { TimeInMs } from '$lib';

export const load: PageServerLoad = async ({ locals }) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
};

export const actions: Actions = {
  login: async (event) => {
    const data = await event.request.formData();
    const password = data.get('password')?.toString();
    const username = data.get('accountName')?.toString();

    if (!password || !username)
      return {
        success: false,
        message: 'Brak hasła lub nazwy'
      };

    if (event.cookies.get('session_id'))
      return {
        success: false,
        message: 'Użytkownik jest już zalogowany'
      };

    const user = await db.user.findUnique({
      where: {
        username: username
      }
    });

    if (!user || !bcrypt.compareSync(password, user.passwordHash))
      return {
        success: false,
        message: 'Nieprawidłowy użytkownik lub hasło'
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
      maxAge: TimeInMs.Week
    });

    return {
      success: true,
      message: 'Pomyślnie zalogowano'
    };
  },
  register: async (event) => {
    const data = await event.request.formData();
    const password = data.get('password')?.toString();
    const passwordConfirm = data.get('passwordConfirm')?.toString();
    const username = data.get('accountName')?.toString();
    const sandboxMode = data.get('sandboxMode') === 'on';

    if (!password || !passwordConfirm || !username || !sandboxMode)
      return {
        success: false,
        message: 'Jedna z podanych wartości jest nieprawidłowa'
      };

    if (event.cookies.get('session_id')) return {
      success: false,
      message: 'Użytkownik jest już zalogowany'
    };

    const isTaken = await db.user.findUnique({
      where: {
        username: username
      }
    });

    if (isTaken) return {
      success: false,
      message: 'Nazwa użytkownika jest już zajęta'
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
      maxAge: TimeInMs.Week
    });

    return {
      success: true,
      message: 'Pomyślnie zarejestrowano'
    };
  },
  logout: async (event) => {
    const sessionID = event.cookies.get('session_id');
    if (!sessionID) return {
      success: false,
      message: "Użytkownik nie jest zalogowany"
    };

    
    await db.session.delete({
      where: {
        id: sessionID
      }
    }).catch(() => null);
    event.cookies.delete('session_id');
    
    return {
      success: true,
      message: "Pomyślnie wylogowano"
    };
  }
};
