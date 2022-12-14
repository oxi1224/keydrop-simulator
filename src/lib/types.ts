import type { colors } from './constants';

export interface CaseThumbnailData {
  price: number;
  imgName: string;
  href: string;
}

export interface Case {
  price: number;
  websiteName: string;
  urlName: string;
  drops: CaseDrop[];
}

export interface CaseDrop {
  skinName: string;
  weaponName: string;
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

export interface CaseItemData extends Omit<CaseDrop, 'dropDetails'> {
  details: DropDetails[];
}

export type SkinRarity = keyof typeof colors.itemBg | keyof typeof colors.gradient;

export interface PopupProps {
  type: 'error' | 'success';
  header: string;
  message: string;
}
