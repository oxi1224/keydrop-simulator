import type {
  Case,
  CaseBattle as DbCaseBattle,
  CaseDrop as DbCaseDrop,
  CaseSection as DbCaseSection,
  GlobalInventoryItem,
  Item,
  User
} from '@prisma/client';
import type { colors } from './constants';

export type UserData = Omit<User, 'passwordHash'>;

export type SkinRarity = keyof typeof colors.itemBg | keyof typeof colors.gradient;

export type SkinWear = 'FN' | 'MW' | 'FT' | 'WW' | 'BS';

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

export interface ItemWithGlobal extends Item {
  globalInvItem: GlobalInventoryItem;
}

export interface CaseBattleCaseData {
  websiteName: string;
  imgName: string;
  urlName: string;
  count: number;
}

export interface CaseBattleDropData {
  [key: number]: string[][];
}

export interface CaseBattleParsedDropData {
  [key: number]: CaseDrop[][];
}

export interface CaseBattleWonItems {
  [key: number]: string[];
}

export interface CaseBattleParsedWonItems {
  [key: number]: CaseDrop[];
}

export type UserWithoutHash = Omit<User, 'passwordHash'>;

export interface CaseBattlePlayer extends UserWithoutHash {
  bot: boolean;
}

export interface CaseBattleBotPlayer {
  id: string;
  username: string;
  pfpUrl: string;
  bot: boolean;
}

export interface CaseBattlePlayers {
  [key: number]: CaseBattlePlayer | CaseBattleBotPlayer;
}

export interface CaseBattle
  extends Omit<DbCaseBattle, 'caseData' | 'drops' | 'players' | 'wonItems'> {
  caseData: CaseBattleCaseData[];
  players: CaseBattlePlayers;
  drops: CaseBattleDropData;
  wonItems: CaseBattleWonItems;
}

export interface ParsedCaseBattle
  extends Omit<DbCaseBattle, 'caseData' | 'drops' | 'players' | 'wonItems'> {
  caseData: CaseBattleCaseData[];
  players: CaseBattlePlayers;
  drops: CaseBattleParsedDropData;
  wonItems: CaseBattleParsedWonItems;
}
