export interface ModInfo {
 modName: string;
 modPath: string;
}

export interface FileSource {
 /** Corrected path inside the archive (forward slashes). */
 entryPath: string;
 /** Extracted file location on disk. */
 absPath: string;
 /** Archive name chain, outermost first. */
 archiveChain: string[];
 /** Lowercased base file name. */
 fileName: string;
}

export interface GroupedFile {
 entryPath: string;
 sources: FileSource[];
}

export function firstArchiveName(src: FileSource): string {
 return src.archiveChain.length > 0 ? src.archiveChain[0] : "";
}

export function fullArchiveName(src: FileSource): string {
 return src.archiveChain.join(" -> ");
}
