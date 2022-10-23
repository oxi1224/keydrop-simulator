import { TimeInMs } from '$lib';
import { db } from '$lib/server';
import bcrypt from 'bcrypt';
import { serialize } from 'cookie';
import { nanoid } from 'nanoid';

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  const { name, password } = await request.json();
  const user = await db.user.findUnique({
    where: {
      username: name
    }
  });

  if (!user || bcrypt.compareSync(password, user.passwordHash))
    return new Response(JSON.stringify({ message: 'Nieprawidłowy użytkownik lub hasło' }), {
      status: 401
    });
  const session = await db.session.create({
    data: {
      id: nanoid(),
      userId: user.id
    }
  });
  const sessionId = session.id;
  return new Response(JSON.stringify({ message: 'Pomyślnie zalogowano' }), {
    status: 200,
    headers: {
      'Set-Cookie': serialize('session_id', sessionId.toString(), {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: false,
        maxAge: TimeInMs.Week
      })
    }
  });
}
