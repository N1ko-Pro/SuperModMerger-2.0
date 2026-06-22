import * as fs from "fs";
import * as path from "path";
import * as yazl from "yazl";
import { ensureDir, walkFiles, toEntryPath } from "../util/fsutil.js";

/**
 * Package every file under sourceDir into a .pak (zip, deflate) at outPath.
 * Entry names use forward slashes (zip standard), mirroring the original tool.
 */
export async function createPak(sourceDir: string, outPath: string): Promise<number> {
 await ensureDir(path.dirname(outPath));
 const files = await walkFiles(sourceDir);
 const zip = new yazl.ZipFile();
 for (const f of files) {
 const entryName = toEntryPath(sourceDir, f);
 zip.addFile(f, entryName);
 }
 await new Promise<void>((resolve, reject) => {
 const out = fs.createWriteStream(outPath);
 out.on("close", () => resolve());
 out.on("error", reject);
 zip.outputStream.on("error", reject);
 zip.outputStream.pipe(out);
 zip.end();
 });
 return files.length;
}
