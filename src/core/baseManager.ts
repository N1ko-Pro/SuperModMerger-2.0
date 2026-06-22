import * as path from "path";
import { ZipReader } from "../archive/zipReader.js";
import { entryFileName, exists } from "../util/fsutil.js";
import { EngineHost } from "./host.js";

interface BaseFile {
 fileName: string;
 entryName: string;
 pakName: string;
}

const BASE_PAKS = ["data0.pak", "data1.pak", "databt.mpak"];

/**
 * Indexes the base game paks found in the LIBS directory and serves vanilla
 * file content plus path-correction suggestions. Mirrors the original
 * BaseModManager but with paths fully decoupled from the game install.
 */
export class BaseManager {
 private readers = new Map<string, ZipReader>();
 private index = new Map<string, BaseFile>();
 private contentCache = new Map<string, string>();
 private astCache = new Map<string, unknown>();
 loaded = false;

 constructor(private readonly baseDir: string, private readonly host: EngineHost) {}

 async load(): Promise<void> {
 const startTime = Date.now();
 let opened = 0;
 for (const pak of BASE_PAKS) {
 const p = path.join(this.baseDir, pak);
 if (!(await exists(p))) {
 continue;
 }
 try {
 const reader = await ZipReader.open(p);
 this.readers.set(pak, reader);
 for (const entryName of reader.listEntries()) {
 const fn = entryFileName(entryName);
 this.index.set(fn, { fileName: fn, entryName, pakName: pak });
 }
 opened += 1;
 } catch (e) {
 this.host.log("warning", "Failed to open base pak " + pak + ": " + String(e));
 }
 }
 if (opened === 0) {
 this.host.log("warning", "No base pak (data0.pak) found in " + this.baseDir + " - merging without vanilla reference");
 this.loaded = false;
 return;
 }
 this.loaded = true;
 this.host.event("baseIndexed", { count: this.index.size, ms: Date.now() - startTime });
 }

 hasPathConflict(modEntryName: string): boolean {
 if (!this.loaded) {
 return false;
 }
 const base = this.index.get(entryFileName(modEntryName));
 if (!base) {
 return false;
 }
 return base.entryName.toLowerCase() !== modEntryName.toLowerCase();
 }

 getSuggestedPath(modEntryName: string): string | null {
 if (!this.loaded) {
 return null;
 }
 return this.index.get(entryFileName(modEntryName))?.entryName ?? null;
 }

 hasFile(modEntryName: string): boolean {
 return this.loaded && this.index.has(entryFileName(modEntryName));
 }

 async extractFileContent(entryName: string): Promise<string | null> {
 if (!this.loaded) {
 return null;
 }
 const base = this.index.get(entryFileName(entryName));
 if (!base) {
 return null;
 }
 const cached = this.contentCache.get(base.entryName);
 if (cached !== undefined) {
 return cached.length === 0 ? null : cached;
 }
 let content = "";
 try {
 const reader = this.readers.get(base.pakName);
 if (reader) {
 content = await reader.readEntryText(base.entryName);
 }
 } catch (e) {
 this.host.log("warning", "Failed to read base file " + base.entryName + ": " + String(e));
 content = "";
 }
 this.contentCache.set(base.entryName, content);
 return content.length === 0 ? null : content;
 }

 /** Parse a base file once and cache the resulting AST root (keyed by canonical path). */
 async parseForm<T>(entryName: string, parseFn: (content: string) => T): Promise<T | null> {
 if (!this.loaded) {
 return null;
 }
 const base = this.index.get(entryFileName(entryName));
 const canonical = base ? base.entryName : entryName;
 const cached = this.astCache.get(canonical);
 if (cached !== undefined) {
 return cached as T;
 }
 const content = await this.extractFileContent(canonical);
 if (content === null) {
 return null;
 }
 const result = parseFn(content);
 this.astCache.set(canonical, result);
 return result;
 }

 close(): void {
 for (const r of this.readers.values()) {
 r.close();
 }
 this.readers.clear();
 this.contentCache.clear();
 this.astCache.clear();
 }
}
