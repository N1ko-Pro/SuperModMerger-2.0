import * as path from "path";
import { extractArchive } from "../archive/extractor.js";
import { ModInfo, FileSource, GroupedFile } from "./types.js";
import { BaseManager } from "./baseManager.js";
import { EngineHost } from "./host.js";
import { entryFileName } from "../util/fsutil.js";

export interface GroupResult {
 grouped: GroupedFile[];
 pathCorrections: number;
}

function shouldSkip(entryPath: string, host: EngineHost, modName: string): boolean {
 const lower = entryPath.toLowerCase();
 if (lower.endsWith(".txt") || lower.endsWith(".md")) {
 return true;
 }
 if (lower.endsWith(".dll") || lower.endsWith(".asi") || lower.endsWith(".exe")) {
 host.event("report", { level: "warning", source: modName, message: "Unsupported dll/asi/exe (handle manually after merge): " + entryPath });
 return true;
 }
 if (lower.endsWith(".rpack") || lower.endsWith(".dds")) {
 host.event("report", { level: "warning", source: modName, message: "Unsupported asset skipped: " + entryPath });
 return true;
 }
 return false;
}

/**
 * Extract every mod, drop unsupported files, correct wrong paths against the
 * base game files and group identical relative paths together for merging.
 */
export async function extractAndGroup(
 mods: ModInfo[],
 tempDir: string,
 base: BaseManager,
 host: EngineHost
): Promise<GroupResult> {
 const groups = new Map<string, GroupedFile>();
 let corrections = 0;
 let idx = 0;
 for (const mod of mods) {
 const modTemp = path.join(tempDir, mod.modName + "_" + idx);
 idx += 1;
 try {
 const extracted = await extractArchive(mod.modPath, modTemp, [mod.modName]);
 host.event("modExtracted", { mod: mod.modName, files: extracted.length });
 const fixes: Array<{ from: string; to: string }> = [];
 for (const ef of extracted) {
 if (shouldSkip(ef.entryPath, host, mod.modName)) {
 continue;
 }
 let target = ef.entryPath;
 if (base.loaded && base.hasPathConflict(ef.entryPath)) {
 const suggested = base.getSuggestedPath(ef.entryPath);
 if (suggested) {
 fixes.push({ from: ef.entryPath, to: suggested });
 target = suggested;
 }
 }
 const src: FileSource = {
 entryPath: target,
 absPath: ef.absPath,
 archiveChain: ef.archiveChain,
 fileName: entryFileName(target),
 };
 let g = groups.get(target);
 if (!g) {
 g = { entryPath: target, sources: [] };
 groups.set(target, g);
 }
 g.sources.push(src);
 }
 if (fixes.length > 0) {
 corrections += fixes.length;
 host.event("pathFix", { mod: mod.modName, fixes });
 }
 } catch (e) {
 host.log("error", "Failed to extract mod " + mod.modName + ": " + String(e));
 host.event("report", { level: "error", source: mod.modName, message: "Extraction failed: " + String(e) });
 }
 }
 return { grouped: [...groups.values()], pathCorrections: corrections };
}
