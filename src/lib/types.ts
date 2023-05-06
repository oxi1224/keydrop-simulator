import type {
  Case,
  CaseDrop as DbCaseDrop,
  CaseSection as DbCaseSection,
  Item,
  User
} from '@prisma/client';
import type { colors } from './constants';

export interface UserData extends Omit<User, 'passwordHash'> {
  inventory: Item[];
}

export type SkinRarity = keyof typeof colors.itemBg | keyof typeof colors.gradient;

export type SkinWear = "FN" | "MW" | "FT" | "WW" | "BS";

export interface ToastProps {
  type: 'error' | 'success';
  header: string;
  message: string;
}

export interface CaseWithDrops extends Case {
  drops: CaseDrop[];
}

export interface CaseDrop extends Omit<DbCaseDrop, 'skinRarity'> {
  skinRarity: keyof typeof colors.itemBg;
}

export interface CaseSection extends DbCaseSection {
  cases: Case[];
}
