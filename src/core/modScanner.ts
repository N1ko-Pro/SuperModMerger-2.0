import * as path from "path";
import { walkFiles, extensionOf } from "../util/fsutil.js";
import { ModInfo } from "./types.js";

const MOD_EXTS = new Set(["pak", "zip", "7z", "rar"]);

/** Scan the Put_Your_Mods directory for mod archives. */
export async function scanMods(modsDir: string): Promise<ModInfo[]> {
 const files = await walkFiles(modsDir);
 const mods: ModInfo[] = [];
 for (const f of files) {
 if (MOD_EXTS.has(extensionOf(f))) {
 mods.push({ modName: path.basename(f), modPath: f });
 }
 }
 mods.sort((a, b) => a.modName.localeCompare(b.modName));
 return mods;
}
