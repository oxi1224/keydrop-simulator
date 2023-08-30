import type { CaseDropWithGlobal } from '$lib/types';
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

export function dropsToItems(drops: CaseDropWithGlobal[], origin: string): ItemAddObject[] {
  return drops.map((drop) => {
    const globalItem = drop.globalInvItem;
    return {
      dropId: nanoid(),
      origin: origin,
      dropDate: new Date(),
      globalInvItem: {
        connect: {
          id: globalItem.id
        }
      }
    };
  }) as ItemAddObject[];
}
