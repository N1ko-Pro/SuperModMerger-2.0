import * as path from "path";
import * as sevenBin from "7zip-bin";
import { extractFull } from "node-7z";
import { createExtractorFromFile } from "node-unrar-js";
import { ZipReader } from "./zipReader.js";
import { ensureDir, walkFiles, toEntryPath, extensionOf, sniffMagic } from "../util/fsutil.js";

export interface ExtractedFile {
 /** Path inside the innermost archive, forward slashes. */
 entryPath: string;
 /** Absolute location of the extracted file on disk. */
 absPath: string;
 /** Archive name chain, outermost first (e.g. mod.zip -> inner.pak). */
 archiveChain: string[];
}

const ARCHIVE_EXTS = new Set(["pak", "zip", "7z", "rar"]);

async function detectKind(archivePath: string): Promise<string> {
 const magic = await sniffMagic(archivePath);
 if (magic !== "unknown") {
 return magic;
 }
 const ext = extensionOf(archivePath);
 if (ext === "pak" || ext === "zip") return "zip";
 if (ext === "7z") return "7z";
 if (ext === "rar") return "rar";
 return "unknown";
}

function isInside(parent: string, child: string): boolean {
 const rel = path.relative(parent, child);
 return !rel.startsWith("..") && !path.isAbsolute(rel);
}

async function extractZip(archivePath: string, destDir: string): Promise<void> {
 const reader = await ZipReader.open(archivePath);
 try {
 for (const name of reader.listEntries()) {
 const dest = path.join(destDir, name);
 if (!isInside(destDir, dest)) {
 continue; // skip path traversal attempts
 }
 await reader.extractEntryToFile(name, dest);
 }
 } finally {
 reader.close();
 }
}

function extract7z(archivePath: string, destDir: string): Promise<void> {
 return new Promise<void>((resolve, reject) => {
 const bin = (sevenBin as { path7za: string }).path7za;
 const stream = extractFull(archivePath, destDir, { $bin: bin, recursive: true });
 stream.on("end", () => resolve());
 stream.on("error", reject);
 });
}

async function extractRar(archivePath: string, destDir: string): Promise<void> {
 await ensureDir(destDir);
 const extractor = await createExtractorFromFile({ filepath: archivePath, targetPath: destDir });
 const extracted = extractor.extract();
 // Iterating the generator performs the actual extraction to targetPath.
 for (const _file of extracted.files) {
 void _file;
 }
}

/**
 * Recursively extract an archive (and any nested archives) into destDir.
 * Returns the flat list of real content files with their archive-relative paths.
 */
export async function extractArchive(
 archivePath: string,
 destDir: string,
 chain: string[]
): Promise<ExtractedFile[]> {
 await ensureDir(destDir);
 const kind = await detectKind(archivePath);
 if (kind === "zip") {
 await extractZip(archivePath, destDir);
 } else if (kind === "7z") {
 await extract7z(archivePath, destDir);
 } else if (kind === "rar") {
 await extractRar(archivePath, destDir);
 } else {
 throw new Error("Unsupported archive format: " + archivePath);
 }

 const files = await walkFiles(destDir);
 const result: ExtractedFile[] = [];
 let nestedIdx = 0;
 for (const f of files) {
 const ext = extensionOf(f);
 if (ARCHIVE_EXTS.has(ext)) {
 const nestedDir = destDir + "__nested_" + nestedIdx;
 nestedIdx += 1;
 const nestedName = path.basename(f);
 const nested = await extractArchive(f, nestedDir, [...chain, nestedName]);
 result.push(...nested);
 } else {
 result.push({ entryPath: toEntryPath(destDir, f), absPath: f, archiveChain: chain });
 }
 }
 return result;
}
