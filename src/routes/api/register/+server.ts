import { TimeInMs } from '$lib';
import { db } from '$lib/server';
import type { RequestEvent } from '@sveltejs/kit';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { nanoid } from 'nanoid';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST(event: RequestEvent) {
  const { name, password, sandboxMode }: { name: string; password: string; sandboxMode: boolean } =
    await event.request.json();
  if (event.cookies.get('session_id'))
    return new Response(JSON.stringify({ message: 'Użytkownik jest już zalogowany' }), {
      status: 406
    });
  const isTaken = await db.user.findUnique({
    where: {
      username: name
    }
  });
  if (isTaken)
    return new Response(JSON.stringify({ message: 'Nazwa użytkownika zajęta' }), { status: 409 });
  const hash = await bcrypt.hash(password, 15);
  const user = await db.user.create({
    data: {
      id: nanoid(),
      username: name,
      passwordHash: hash,
      balance: 50,
      sandboxMode: sandboxMode || false
    }
  });
  const session = await db.session.create({
    data: {
      id: nanoid(),
      userId: user.id
    }
  });
  return new Response(JSON.stringify({ message: 'Pomyślnie stworzono konto.\nOdśwież strone.' }), {
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
