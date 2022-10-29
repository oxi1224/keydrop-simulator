import { PrismaClient, type User } from '@prisma/client';

let prisma: PrismaClient;

if (typeof window === 'undefined') {
  if (process.env.NODE_ENV === 'production') {
    prisma = new PrismaClient();
  } else {
    if (!global.prisma) {
      global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const db = prisma;

export async function userFromSessionID(sessionID: string): Promise<User | null> {
  const session = await db.session.findUnique({
    where: {
      id: sessionID
    }
  });
  if (!session) return null;
  const user = await db.user.findUnique({
    where: {
      id: session?.id
    }
  });
  return user;
}