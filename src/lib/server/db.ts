/* eslint-disable indent */
import type { CaseWithDrops } from '$lib/types';
import { PrismaClient, type Case } from '@prisma/client';

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

export async function userFromSessionID(sessionID: string) {
  const session = await db.session.findUnique({
    where: {
      id: sessionID
    }
  });
  if (!session) return null;
  const user = await db.user.findUnique({
    where: {
      id: session?.userId
    },
    include: {
      inventory: true
    }
  });
  return user;
}

export async function getCaseData(caseName: string) {
  const caseObj =
    caseName === 'sections'
      ? await db.caseSection.findMany({
          include: {
            cases: {
              orderBy: {
                positionInGrid: 'asc'
              }
            }
          },
          orderBy: {
            position: 'asc'
          }
        })
      : await db.case.findFirst({
          where: {
            OR: [{ urlName: caseName }, { websiteName: caseName }]
          },
          include: {
            drops: true
          }
        });
  return caseObj as CaseWithDrops | Case[] | null;
}
