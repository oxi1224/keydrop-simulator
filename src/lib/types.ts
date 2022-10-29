import type { User } from '@prisma/client';
import type { colors } from './constants';

export interface CaseThumbnailData {
  [key: string]: {
    price: number;
    imgName: string;
    href: string;
  };
}

export interface CaseData {
  price: number;
  websiteName: string;
  drops: CaseDrop[];
}

export interface CaseDrop {
  skinName: string;
  skinWeapon: string;
  skinPriceRange: string;
  skinDisplayChance: string;
  skinImgSource: string;
  skinRarity: SkinRarity;
  dropDetails: DropDetails;
}

export interface DropDetails {
  quality: string;
  price: number;
  range: [number, number];
  odds: string;
}

export interface Item {
  skinName: string;
  skinPrice: number;
  skinWeapon: string;
  skinImgSource: string;
  skinRarity: SkinRarity;
  skinQuality: string;
}

export interface CaseItemData extends Omit<CaseDrop, 'dropDetails'> {
  details: DropDetails[];
}

export type SkinRarity = keyof typeof colors.itemBg | keyof typeof colors.gradient;

export interface PopupProps {
  type: 'error' | 'success';
  header: string;
  message: string;
}

export interface UserData {
  username: string;
  inventory: User['inventory'];
  balance: number;
  goldBalance: number;
  sandboxMode: boolean;
}
