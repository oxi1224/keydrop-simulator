import { TimeInMs } from "$lib";
import { db } from "$lib/server";
import bcrypt from "bcrypt";
import { serialize } from "cookie";
import { nanoid } from "nanoid";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function POST({ request }: { request: Request }) {
  const { name, password }: { name: string, password: string } = await request.json();
  const isTaken = await db.user.findFirst({
    where: {
      username: name
    }
  });
  if (isTaken) return new Response(JSON.stringify({ message: 'Nazwa użytkownika zajęta' }), { status: 409 });
  const hash = await bcrypt.hash(password, 15);
  const user = await db.user.create({
    data: {
      id: nanoid(),
      username: name,
      passwordHash: hash
    }
  });
  const session = await db.session.create({
    data: {
      id: nanoid(),
      userId: user.id
    }
  });
  const sessionId = session.id;
  return new Response(
    JSON.stringify({ message: 'Sukces' }),
    {
      status: 201,
      headers: {
        'Set-Cookie': serialize('session_id', sessionId.toString(), {
          path: '/',
          httpOnly: true,
          sameSite: 'strict',
          secure: false,
          maxAge: TimeInMs.Week
        })
      }
    }
  );
};