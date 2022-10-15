import type { colors } from './constants';

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
  price: string;
  range: [number, number];
  odds: string;
}

export interface CaseItemData extends Omit<CaseDrop, 'dropDetails'> {
  details: DropDetails[];
}

export type SkinRarity = keyof typeof colors.itemBg | keyof typeof colors.gradient;
