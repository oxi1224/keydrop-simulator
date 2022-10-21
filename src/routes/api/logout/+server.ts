import { db } from "$lib/server";
import { parse, serialize } from "cookie";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function GET({ headers: { cookie } }: {
  headers: {
    cookie: any,
  }
}) {
  const cookies = parse(cookie || '');

  if (cookies.session_id) {
    await db.session.delete({
      where: {
        id: cookies.session_id
      }
    });
  }

  return {
    status: 200,
    headers: {
      'Set-Cookie': serialize('session_id', '', {
        path: '/',
        expires: new Date(0),
      }),
    },
  };
};