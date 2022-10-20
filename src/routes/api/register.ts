import { TimeInMs } from "$lib";
import { Sessions, Users } from "$lib/server";
import bcrypt from "bcrypt";
import { serialize } from "cookie";

export async function post({ body: { name, password } }: {
  body: {
    name: string,
    password: string,
  }
}) {
  
  const hash = await bcrypt.hash(password, 15);
  const user = await Users.create({
    username: name,
    passwordHash: hash
  });
  const session = await Sessions.create({
    userId: user.id
  });
  const sessionId = session.id;
  return {
    status: 201,
    headers: {
      'Set-Cookie': serialize('session_id', sessionId, {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: TimeInMs.Week
      })
    },
    body: {
      message: 'Successs'
    }
  };
};