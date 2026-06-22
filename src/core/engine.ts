import * as os from "os";
import * as path from "path";
import * as fsp from "fs/promises";
import type { GroupedFile, FileSource } from "./types.js";
import { firstArchiveName } from "./types.js";
import { BaseManager } from "./baseManager.js";
import type { EngineHost, AssetConflictPolicy } from "./host.js";
import { MergerContext } from "./mergerContext.js";
import { extractAndGroup } from "./modExtractor.js";
import { scanMods } from "./modScanner.js";
import { getMerger } from "../merger/mergerFactory.js";
import { createPak } from "../archive/pakWriter.js";
import { ensureDir, rmrf, fileSize, sha256 } from "../util/fsutil.js";

export interface MergeOptions {
 baseDir: string;
 modsDir: string;
 outputPath: string;
 globalFix: boolean;
 host: EngineHost;
 tempDir?: string;
}

export interface MergeSummary {
 totalProcessed: number;
 merged: number;
 pathCorrections: number;
 output: string;
 tookMs: number;
}

/** Orchestrates the whole merge: extract, group, merge/copy/resolve, package. */
export class MergeEngine {
 private readonly opts: MergeOptions;
 private readonly host: EngineHost;
 private readonly tempDir: string;
 private mergedCount = 0;
 private totalProcessed = 0;

 constructor(opts: MergeOptions) {
 this.opts = opts;
 this.host = opts.host;
 this.tempDir = opts.tempDir ?? path.join(os.tmpdir(), "SuperModMergerTemp");
 }

 async run(): Promise<MergeSummary> {
 const start = Date.now();
 const mods = await scanMods(this.opts.modsDir);
 this.host.event("modsFound", { count: mods.length, mods: mods.map((m) => m.modName) });
 if (mods.length === 0) {
 throw new Error("No mods found in " + this.opts.modsDir);
 }
 await rmrf(this.tempDir);
 const base = new BaseManager(this.opts.baseDir, this.host);
 await base.load();
 let pathCorrections = 0;
 try {
 const extractDir = path.join(this.tempDir, "extract");
 const grouped = await extractAndGroup(mods, extractDir, base, this.host);
 pathCorrections = grouped.pathCorrections;
 this.host.event("extracted", { groups: grouped.grouped.length });
 const mergedDir = path.join(this.tempDir, "merged");
 await ensureDir(mergedDir);
 await this.mergeAllFiles(grouped.grouped, mergedDir, base);
 this.host.event("packaging", { output: this.opts.outputPath });
 const written = await createPak(mergedDir, this.opts.outputPath);
 const summary: MergeSummary = {
 totalProcessed: this.totalProcessed,
 merged: this.mergedCount,
 pathCorrections,
 output: this.opts.outputPath,
 tookMs: Date.now() - start,
 };
 this.host.event("stats", { totalProcessed: summary.totalProcessed, merged: summary.merged, pathCorrections: summary.pathCorrections, filesPackaged: written });
 return summary;
 } finally {
 base.close();
 await rmrf(this.tempDir);
 }
 }

 private async mergeAllFiles(grouped: GroupedFile[], mergedDir: string, base: BaseManager): Promise<void> {
 const total = grouped.length;
 this.host.event("processingStart", { total });
 let i = 0;
 for (const group of grouped) {
 this.totalProcessed++;
 i++;
 this.host.progress(i, total, group.entryPath);
 try {
 if (group.sources.length === 1) {
 if (this.opts.globalFix) {
 await this.mergeSingleFile(group, mergedDir, base);
 } else {
 await this.copyTo(group.sources[0].absPath, path.join(mergedDir, group.entryPath));
 }
 } else {
 await this.mergeFiles(group, mergedDir, base);
 }
 } catch (e) {
 this.host.log("error", "Failed processing " + group.entryPath + ": " + String(e));
 }
 }
 }

 private async mergeSingleFile(group: GroupedFile, mergedDir: string, base: BaseManager): Promise<void> {
 const relPath = group.entryPath;
 const fileCurrent = group.sources[0];
 try {
 if (base.loaded) {
 const vanilla = await base.extractFileContent(relPath);
 if (vanilla !== null) {
 const ctx = new MergerContext(base, this.host);
 const merger = getMerger(relPath, ctx);
 if (merger) {
 const modName = firstArchiveName(fileCurrent);
 ctx.configure(relPath, "data0.pak", modName, true);
 const content = await fsp.readFile(fileCurrent.absPath, "utf8");
 const result = await merger.merge(
 { content: vanilla, entryName: relPath, name: "data0.pak" },
 { content, entryName: relPath, name: modName }
 );
 await this.writeTo(path.join(mergedDir, relPath), result.mergedContent);
 this.mergedCount++;
 return;
 }
 }
 }
 await this.copyTo(fileCurrent.absPath, path.join(mergedDir, relPath));
 } catch (e) {
 await this.copyTo(fileCurrent.absPath, path.join(mergedDir, relPath));
 this.host.event("report", { level: "error", source: fileCurrent.fileName, message: "Merge failed for " + relPath + ", used original. " + String(e) });
 }
 }

 private async mergeFiles(group: GroupedFile, mergedDir: string, base: BaseManager): Promise<void> {
 const relPath = group.entryPath;
 const fileSources = group.sources;
 if (await this.areAllFilesIdentical(fileSources)) {
 await this.copyTo(fileSources[0].absPath, path.join(mergedDir, relPath));
 return;
 }
 const ctx = new MergerContext(base, this.host);
 const merger = getMerger(relPath, ctx);
 if (!merger) {
 await this.chooseWhichAssetToUse(relPath, fileSources, mergedDir);
 return;
 }
 try {
 this.host.event("mergingFile", { file: relPath, versions: fileSources.length });
 let accumulatedContent = "";
 let vanilla: string | null = null;
 if (base.loaded) vanilla = await base.extractFileContent(relPath);
 for (let i = 0; i < fileSources.length; i++) {
 const fileCurrent = fileSources[i];
 const currentModName = firstArchiveName(fileCurrent);
 const currentContent = await fsp.readFile(fileCurrent.absPath, "utf8");
 if (i === 0) {
 if (vanilla !== null) {
 ctx.configure(relPath, "data0.pak", currentModName, true);
 const result = await merger.merge(
 { content: vanilla, entryName: relPath, name: "data0.pak" },
 { content: currentContent, entryName: relPath, name: currentModName }
 );
 accumulatedContent = result.mergedContent;
 } else {
 accumulatedContent = currentContent;
 }
 } else {
 const previousModName = firstArchiveName(fileSources[i - 1]);
 ctx.configure(relPath, previousModName, currentModName, false);
 const result = await merger.merge(
 { content: accumulatedContent, entryName: relPath, name: previousModName },
 { content: currentContent, entryName: relPath, name: currentModName }
 );
 accumulatedContent = result.mergedContent;
 }
 }
 await this.writeTo(path.join(mergedDir, relPath), accumulatedContent);
 this.mergedCount++;
 } catch (e) {
 const last = fileSources[fileSources.length - 1];
 await this.copyTo(last.absPath, path.join(mergedDir, relPath));
 this.host.event("report", { level: "error", source: relPath, message: "Merge failed, used last version. " + String(e) });
 }
 }

 private async chooseWhichAssetToUse(relPath: string, fileSources: FileSource[], mergedDir: string): Promise<void> {
 let idx: number;
 if (this.host.resolveAssetConflict) {
 idx = await this.host.resolveAssetConflict({ path: relPath, options: fileSources.map(firstArchiveName) });
 } else {
 idx = await this.assetPolicyIndex(fileSources, this.host.assetConflictPolicy);
 }
 if (idx < 1 || idx > fileSources.length) idx = fileSources.length;
 const chosen = fileSources[idx - 1];
 this.host.event("assetResolved", { path: relPath, chosen: firstArchiveName(chosen) });
 await this.copyTo(chosen.absPath, path.join(mergedDir, relPath));
 }

 private async assetPolicyIndex(fileSources: FileSource[], policy: AssetConflictPolicy): Promise<number> {
 if (policy === "first") return 1;
 if (policy === "last") return fileSources.length;
 let bestIdx = 0;
 let bestSize = policy === "smallest" ? Number.MAX_SAFE_INTEGER : -1;
 for (let i = 0; i < fileSources.length; i++) {
 const s = await fileSize(fileSources[i].absPath);
 const better = policy === "smallest" ? s < bestSize : s > bestSize;
 if (better) { bestSize = s; bestIdx = i; }
 }
 return bestIdx + 1;
 }

 private async areAllFilesIdentical(fileSources: FileSource[]): Promise<boolean> {
 if (fileSources.length <= 1) return true;
 const firstSize = await fileSize(fileSources[0].absPath);
 for (let i = 1; i < fileSources.length; i++) {
 if ((await fileSize(fileSources[i].absPath)) !== firstSize) return false;
 }
 const firstHash = await sha256(fileSources[0].absPath);
 for (let i = 1; i < fileSources.length; i++) {
 if ((await sha256(fileSources[i].absPath)) !== firstHash) return false;
 }
 return true;
 }

 private async copyTo(src: string, dest: string): Promise<void> {
 await ensureDir(path.dirname(dest));
 await fsp.copyFile(src, dest);
 }

 private async writeTo(dest: string, content: string): Promise<void> {
 await ensureDir(path.dirname(dest));
 await fsp.writeFile(dest, content, "utf8");
 }
}
