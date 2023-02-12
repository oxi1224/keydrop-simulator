import type { Case, CaseDrop as DbCaseDrop, CaseSection as DbCaseSection } from '@prisma/client';
import type { colors } from './constants';

export type SkinRarity = keyof typeof colors.itemBg | keyof typeof colors.gradient;

export interface PopupProps {
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
