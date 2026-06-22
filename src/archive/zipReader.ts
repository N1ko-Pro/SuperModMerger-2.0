import * as yauzl from "yauzl";
import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "path";

/**
 * Random-access reader for a .pak/.zip file. Indexes the central directory up
 * front (cheap even for multi-GB archives) and extracts individual entries on
 * demand. Used for the base game pak (data0.pak) so we never extract it fully.
 */
export class ZipReader {
 private constructor(
 private readonly zipfile: yauzl.ZipFile,
 private readonly entries: Map<string, yauzl.Entry>
 ) {}

 static open(filePath: string): Promise<ZipReader> {
 return new Promise<ZipReader>((resolve, reject) => {
 yauzl.open(filePath, { lazyEntries: true, autoClose: false }, (err, zipfile) => {
 if (err || !zipfile) {
 reject(err ?? new Error("Failed to open archive: " + filePath));
 return;
 }
 const entries = new Map<string, yauzl.Entry>();
 zipfile.on("entry", (entry: yauzl.Entry) => {
 if (!entry.fileName.endsWith("/")) {
 entries.set(entry.fileName, entry);
 }
 zipfile.readEntry();
 });
 zipfile.on("end", () => resolve(new ZipReader(zipfile, entries)));
 zipfile.on("error", (e) => reject(e));
 zipfile.readEntry();
 });
 });
 }

 listEntries(): string[] {
 return [...this.entries.keys()];
 }

 hasEntry(name: string): boolean {
 return this.entries.has(name);
 }

 get size(): number {
 return this.entries.size;
 }

 readEntryBuffer(name: string): Promise<Buffer> {
 const entry = this.entries.get(name);
 if (!entry) {
 return Promise.reject(new Error("Entry not found: " + name));
 }
 return new Promise<Buffer>((resolve, reject) => {
 this.zipfile.openReadStream(entry, (err, stream) => {
 if (err || !stream) {
 reject(err ?? new Error("Failed to read entry: " + name));
 return;
 }
 const chunks: Buffer[] = [];
 stream.on("data", (c: Buffer) => chunks.push(c));
 stream.on("end", () => resolve(Buffer.concat(chunks)));
 stream.on("error", reject);
 });
 });
 }

 async readEntryText(name: string, encoding: BufferEncoding = "utf8"): Promise<string> {
 const buf = await this.readEntryBuffer(name);
 return buf.toString(encoding);
 }

 extractEntryToFile(name: string, destFile: string): Promise<void> {
 const entry = this.entries.get(name);
 if (!entry) {
 return Promise.reject(new Error("Entry not found: " + name));
 }
 return new Promise<void>((resolve, reject) => {
 void fsp.mkdir(path.dirname(destFile), { recursive: true }).then(() => {
 this.zipfile.openReadStream(entry, (err, stream) => {
 if (err || !stream) {
 reject(err ?? new Error("Failed to read entry: " + name));
 return;
 }
 const out = fs.createWriteStream(destFile);
 stream.on("error", reject);
 out.on("error", reject);
 out.on("finish", () => resolve());
 stream.pipe(out);
 });
 }, reject);
 });
 }

 close(): void {
 try {
 this.zipfile.close();
 } catch {
 // ignore
 }
 }
}
