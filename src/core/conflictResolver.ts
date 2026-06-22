import { ConflictRecord, UserChoice, userChoiceByOrder } from "./conflict.js";
import type { MergerContext } from "./mergerContext.js";

/**
 * Resolve conflict records that were not auto-merged. Uses the interactive
 * host callback when available, otherwise falls back to the configured policy.
 * Supports the sticky "use all base / use all incoming" choices.
 */
export async function resolveConflicts(conflicts: ConflictRecord[], context: MergerContext): Promise<void> {
 const unresolved = conflicts.filter((c) => c.userChoice === null);
 if (unresolved.length === 0) {
 return;
 }
 const host = context.host;
 let sticky: UserChoice | null = null;
 for (const record of unresolved) {
 if (sticky === UserChoice.USE_ALL_BASE) {
 record.userChoice = UserChoice.BASE_MOD;
 continue;
 }
 if (sticky === UserChoice.USE_ALL_MERGE) {
 record.userChoice = UserChoice.MERGE_MOD;
 continue;
 }
 if (host.resolveCodeConflict) {
 const order = await host.resolveCodeConflict({
 file: record.fileName,
 signature: record.signature,
 baseModName: record.baseModName,
 baseLine: record.baseNode.lineNumber,
 baseText: record.baseNode.sourceText.trim(),
 incomingModName: record.mergeModName,
 incomingLine: record.modNode.lineNumber,
 incomingText: record.modNode.sourceText.trim(),
 });
 const choice = userChoiceByOrder(order);
 if (choice === UserChoice.USE_ALL_BASE) {
 sticky = UserChoice.USE_ALL_BASE;
 record.userChoice = UserChoice.BASE_MOD;
 } else if (choice === UserChoice.USE_ALL_MERGE) {
 sticky = UserChoice.USE_ALL_MERGE;
 record.userChoice = UserChoice.MERGE_MOD;
 } else if (choice === UserChoice.BASE_MOD) {
 record.userChoice = UserChoice.BASE_MOD;
 } else {
 record.userChoice = UserChoice.MERGE_MOD;
 }
 } else {
 record.userChoice = host.codeConflictPolicy === "base" ? UserChoice.BASE_MOD : UserChoice.MERGE_MOD;
 }
 }
 host.event("codeConflictsResolved", { count: unresolved.length });
}
