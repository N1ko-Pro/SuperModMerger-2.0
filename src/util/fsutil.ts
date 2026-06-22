import * as fs from "fs";
import * as fsp from "fs/promises";
import * as path from "path";
import * as crypto from "crypto";

export async function ensureDir(dir: string): Promise<void> {
 await fsp.mkdir(dir, { recursive: true });
}

export async function rmrf(target: string): Promise<void> {
 await fsp.rm(target, { recursive: true, force: true });
}

export async function exists(p: string): Promise<boolean> {
 try {
 await fsp.access(p);
 return true;
 } catch {
 return false;
 }
}

export async function walkFiles(dir: string): Promise<string[]> {
 const out: string[] = [];
 async function rec(d: string): Promise<void> {
 let entries: fs.Dirent[];
 try {
 entries = await fsp.readdir(d, { withFileTypes: true });
 } catch {
 return;
 }
 for (const e of entries) {
 const full = path.join(d, e.name);
 if (e.isDirectory()) {
 await rec(full);
 } else if (e.isFile()) {
 out.push(full);
 }
 }
 }
 await rec(dir);
 return out;
}

/** Relative archive-style path (forward slashes) of a file inside baseDir. */
export function toEntryPath(baseDir: string, file: string): string {
 return path.relative(baseDir, file).split(path.sep).join("/");
}

/** Lowercased base file name of an entry path (mirrors the original getEntryFileName). */
export function entryFileName(entryPath: string): string {
 const norm = entryPath.replace(/\\\\/g, "/");
 const idx = norm.lastIndexOf("/");
 return norm.substring(idx + 1).toLowerCase();
}

export function extensionOf(p: string): string {
 const base = p.replace(/\\\\/g, "/");
 const slash = base.lastIndexOf("/");
 const name = base.substring(slash + 1);
 const dot = name.lastIndexOf(".");
 return dot < 0 ? "" : name.substring(dot + 1).toLowerCase();
}

/** Detect archive type by magic bytes: zip | 7z | rar | unknown. */
export async function sniffMagic(file: string): Promise<string> {
 const fh = await fsp.open(file, "r");
 try {
 const buf = Buffer.alloc(8);
 const { bytesRead } = await fh.read(buf, 0, 8, 0);
 if (bytesRead >= 4 && buf[0] === 0x50 && buf[1] === 0x4b && (buf[2] === 0x03 || buf[2] === 0x05 || buf[2] === 0x07)) {
 return "zip";
 }
 if (bytesRead >= 6 && buf[0] === 0x37 && buf[1] === 0x7a && buf[2] === 0xbc && buf[3] === 0xaf && buf[4] === 0x27 && buf[5] === 0x1c) {
 return "7z";
 }
 if (bytesRead >= 4 && buf[0] === 0x52 && buf[1] === 0x61 && buf[2] === 0x72 && buf[3] === 0x21) {
 return "rar";
 }
 return "unknown";
 } finally {
 await fh.close();
 }
}

export function sha256(file: string): Promise<string> {
 return new Promise<string>((resolve, reject) => {
 const hash = crypto.createHash("sha256");
 const stream = fs.createReadStream(file);
 stream.on("data", (d) => hash.update(d as Buffer));
 stream.on("end", () => resolve(hash.digest("hex")));
 stream.on("error", reject);
 });
}

export async function fileSize(file: string): Promise<number> {
 const st = await fsp.stat(file);
 return st.size;
}
