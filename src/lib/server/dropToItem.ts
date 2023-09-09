import type { CaseDrop } from '$lib/types';
import { nanoid } from 'nanoid';

export interface ItemAddObject {
  dropId: string;
  origin: string;
  dropDate: Date;
  globalInvItem: {
    connect: {
      id: string;
    };
  };
}

export function dropsToItems(drops: CaseDrop[], origin: string): ItemAddObject[] {
  return drops.map((drop) => {
    return {
      dropId: nanoid(),
      origin: origin,
      dropDate: new Date(),
      globalInvItem: {
        connect: {
          id: drop.globalInvID
        }
      }
    };
  }) as ItemAddObject[];
}
