import type { BaseTreeNode } from "./baseTreeNode.js";

export enum UserChoice {
 BASE_MOD = 0,
 MERGE_MOD = 1,
 USE_ALL_BASE = 2,
 USE_ALL_MERGE = 3,
}

/** Map a 1-based menu order to a UserChoice (mirrors findByOrder). */
export function userChoiceByOrder(order: number | null | undefined): UserChoice | null {
 if (order === null || order === undefined) {
 return null;
 }
 const v = order - 1;
 if (v >= 0 && v <= 3) {
 return v as UserChoice;
 }
 return null;
}

export interface ConflictRecord {
 fileName: string;
 baseModName: string;
 mergeModName: string;
 signature: string;
 baseNode: BaseTreeNode;
 modNode: BaseTreeNode;
 userChoice: UserChoice | null;
}
