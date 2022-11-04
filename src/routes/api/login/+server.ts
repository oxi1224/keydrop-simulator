import { TimeInMs } from '$lib';
import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { nanoid } from 'nanoid';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  if (event.cookies.get('session_id'))
    return new Response(JSON.stringify({ message: 'Użytkownik jest już zalogowany' }), {
      status: 406
    });
  const { name, password } = await event.request.json();
  const user = await db.user.findUnique({
    where: {
      username: name
    }
  });
  if (!user || !bcrypt.compareSync(password, user.passwordHash))
    return new Response(JSON.stringify({ message: 'Nieprawidłowy użytkownik lub hasło' }), {
      status: 401
    });
  const session = await db.session.create({
    data: {
      id: nanoid(),
      userId: user.id
    }
  });
  return new Response(JSON.stringify({ message: 'Pomyślnie zalogowano.\nOdśwież strone.' }), {
    status: 200,
    headers: {
      'Set-Cookie': serialize('session_id', session.id.toString(), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: TimeInMs.Week
      })
    }
  });
}
