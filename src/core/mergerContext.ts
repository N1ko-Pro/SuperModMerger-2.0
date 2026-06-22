import type { BaseManager } from "./baseManager.js";
import type { EngineHost } from "./host.js";

/** Records which mod a merged signature came from (for conflict attribution). */
export class MergedHistory {
 private map = new Map<string, string>();
 markSignature(signature: string, modName: string): void {
 if (!this.map.has(signature)) {
 this.map.set(signature, modName);
 }
 }
 getModNameFromSignature(signature: string): string | null {
 return this.map.get(signature) ?? null;
 }
}

/** Per-file merge context shared between the engine, mergers and resolver. */
export class MergerContext {
 baseManager: BaseManager;
 host: EngineHost;
 mergingFileName = "";
 accumulatedModName = "";
 mergeModName = "";
 mergedHistory = new MergedHistory();
 isFirstMerge = false;

 constructor(baseManager: BaseManager, host: EngineHost) {
 this.baseManager = baseManager;
 this.host = host;
 }

 configure(mergingFileName: string, accumulatedModName: string, incomingModName: string, isFirstMerge: boolean): void {
 this.mergingFileName = mergingFileName;
 this.accumulatedModName = accumulatedModName;
 this.mergeModName = incomingModName;
 this.isFirstMerge = isFirstMerge;
 }
}
