import { app, BrowserWindow, ipcMain, shell, dialog } from "electron";
import * as path from "path";
import * as fsp from "fs/promises";
import { MergeEngine } from "../src/core/engine.js";
import type { EngineHost, LogLevel, CodeConflictRequest, AssetConflictRequest, CodeConflictPolicy, AssetConflictPolicy } from "../src/core/host.js";
import { scanMods } from "../src/core/modScanner.js";
import * as os from "os";
import { exists, ensureDir, rmrf } from "../src/util/fsutil.js";
import { createPak } from "../src/archive/pakWriter.js";
import { ZipReader } from "../src/archive/zipReader.js";

let mainWindow: BrowserWindow | null = null;
let merging = false;
let conflictCounter = 0;
const pendingConflicts = new Map<number, (choice: number) => void>();

const BASE_PAKS = ["data0.pak", "data1.pak", "databt.mpak"];

function appRoot(): string {
 if (process.env.PORTABLE_EXECUTABLE_DIR) {
 return process.env.PORTABLE_EXECUTABLE_DIR;
 }
 return app.isPackaged ? path.dirname(app.getPath("exe")) : path.join(__dirname, "..", "..");
}
function libsDir(): string { return path.join(appRoot(), "LIBS"); }
function modsDir(): string { return path.join(appRoot(), "Put_Your_Mods"); }
function outputDir(): string { return path.join(appRoot(), "output"); }

async function ensureFolders(): Promise<void> {
 await fsp.mkdir(libsDir(), { recursive: true });
 await fsp.mkdir(modsDir(), { recursive: true });
 await fsp.mkdir(outputDir(), { recursive: true });
}

function send(channel: string, payload: unknown): void {
 if (mainWindow && !mainWindow.isDestroyed()) {
 mainWindow.webContents.send(channel, payload);
 }
}

function createWindow(): void {
 mainWindow = new BrowserWindow({
 width: 1200,
 height: 1220,
 minWidth: 960,
 minHeight: 660,
 backgroundColor: "#0a0a0c",
 frame: false,
 show: false,
 icon: path.join(__dirname, "..", "..", "build", "icon.ico"),
 webPreferences: {
 preload: path.join(__dirname, "preload.js"),
 contextIsolation: true,
 nodeIntegration: false,
 },
 });
 const indexHtml = path.join(__dirname, "..", "..", "renderer", "index.html");
 void mainWindow.loadFile(indexHtml);
 mainWindow.once("ready-to-show", () => mainWindow?.show());
 mainWindow.on("maximize", () => mainWindow?.webContents.send("win:state", { maximized: true }));
 mainWindow.on("unmaximize", () => mainWindow?.webContents.send("win:state", { maximized: false }));
 mainWindow.on("closed", () => { mainWindow = null; });
}

async function buildStatus() {
 await ensureFolders();
 const foundPaks: string[] = [];
 for (const p of BASE_PAKS) {
 if (await exists(path.join(libsDir(), p))) foundPaks.push(p);
 }
 const mods = await scanMods(modsDir());
 return {
 libsDir: libsDir(),
 modsDir: modsDir(),
 outputDir: outputDir(),
 basePaks: foundPaks,
 hasBasePak: foundPaks.includes("data0.pak"),
 mods: mods.map((m) => m.modName),
 };
}

function makeHost(options: { codeConflict: string; assetConflict: string }): EngineHost {
 const host: EngineHost = {
 codeConflictPolicy: (options.codeConflict === "base" ? "base" : "incoming") as CodeConflictPolicy,
 assetConflictPolicy: (["first", "last", "largest", "smallest"].includes(options.assetConflict) ? options.assetConflict : "largest") as AssetConflictPolicy,
 log(level: LogLevel, message: string): void {
 send("merge:event", { type: "log", level, message });
 },
 progress(current: number, total: number, file: string): void {
 send("merge:event", { type: "progress", current, total, file });
 },
 event(type: string, payload: Record<string, unknown>): void {
 send("merge:event", { type, ...payload });
 },
 };
 if (options.codeConflict === "interactive") {
 host.resolveCodeConflict = (req: CodeConflictRequest): Promise<number> => requestConflict("code", req);
 }
 if (options.assetConflict === "interactive") {
 host.resolveAssetConflict = (req: AssetConflictRequest): Promise<number> => requestConflict("asset", req);
 }
 return host;
}

function requestConflict(kind: string, req: unknown): Promise<number> {
 return new Promise<number>((resolve) => {
 const id = ++conflictCounter;
 pendingConflicts.set(id, resolve);
 send("merge:conflict", { id, kind, request: req });
 });
}

async function runMergeSmoke(): Promise<void> {
 const root = path.join(os.tmpdir(), "smm_pkg_test");
 await rmrf(root);
 const libs = path.join(root, "LIBS");
 const mods = path.join(root, "Put_Your_Mods");
 const output = path.join(root, "output", "data2.pak");
 const baseSrc = path.join(root, "_base");
 await ensureDir(path.join(baseSrc, "scripts"));
 await fsp.writeFile(path.join(baseSrc, "scripts", "t.scr"), "Set(\"a\", 1);\nSet(\"b\", 1);\n");
 await createPak(baseSrc, path.join(libs, "data0.pak"));
 const aSrc = path.join(root, "_a");
 await ensureDir(path.join(aSrc, "scripts"));
 await fsp.writeFile(path.join(aSrc, "scripts", "t.scr"), "Set(\"a\", 2);\nSet(\"b\", 1);\n");
 await createPak(aSrc, path.join(mods, "A.pak"));
 const bSrc = path.join(root, "_b");
 await ensureDir(path.join(bSrc, "scripts"));
 await fsp.writeFile(path.join(bSrc, "scripts", "t.scr"), "Set(\"a\", 1);\nSet(\"b\", 5);\n");
 await createPak(bSrc, path.join(mods, "B.zip"));
 const host = makeHost({ codeConflict: "incoming", assetConflict: "largest" });
 const engine = new MergeEngine({ baseDir: libs, modsDir: mods, outputPath: output, globalFix: false, host });
 const summary = await engine.run();
 const reader = await ZipReader.open(output);
 const scr = reader.hasEntry("scripts/t.scr") ? await reader.readEntryText("scripts/t.scr") : "";
 reader.close();
 console.log("SMOKE_MERGE_RESULT merged=" + summary.merged + " scr=" + JSON.stringify(scr));
 await rmrf(root);
}

ipcMain.handle("app:getStatus", async () => buildStatus());

ipcMain.on("win:minimize", () => mainWindow?.minimize());
ipcMain.on("win:maximize", () => {
 if (!mainWindow) return;
 if (mainWindow.isMaximized()) mainWindow.unmaximize();
 else mainWindow.maximize();
});
ipcMain.on("win:close", () => mainWindow?.close());

const MOD_EXTENSIONS = ["pak", "zip", "7z", "rar"];
const GAME_REL = path.join("steamapps", "common", "Dying Light The Beast", "ph_ft", "source", "data0.pak");

/** Search local drives / Steam libraries for the game's data0.pak. */
async function findBasePak(): Promise<string | null> {
 const candidates: string[] = [];
 const drives = "CDEFGHIJKLABMNOPQRSTUVWXYZ".split("");
 const roots = [
 "SteamLibrary",
 path.join("Program Files (x86)", "Steam"),
 path.join("Program Files", "Steam"),
 "Steam",
 path.join("Games", "Steam"),
 ];
 for (const d of drives) {
 const base = d + ":\\";
 for (const r of roots) candidates.push(path.join(base, r, GAME_REL));
 }
 // Parse Steam's libraryfolders.vdf to discover custom library locations.
 const vdfPaths = [
 "C:\\Program Files (x86)\\Steam\\steamapps\\libraryfolders.vdf",
 "C:\\Program Files\\Steam\\steamapps\\libraryfolders.vdf",
 ];
 for (const vdf of vdfPaths) {
 if (await exists(vdf)) {
 try {
 const txt = await fsp.readFile(vdf, "utf8");
 const re = /"path"\s*"([^"]+)"/g;
 let m: RegExpExecArray | null;
 while ((m = re.exec(txt)) !== null) {
 const libPath = m[1].replace(/\\\\/g, "\\");
 candidates.push(path.join(libPath, GAME_REL));
 }
 } catch { /* ignore malformed vdf */ }
 }
 }
 for (const c of candidates) {
 if (await exists(c)) return c;
 }
 return null;
}

async function copyMods(filePaths: string[]): Promise<string[]> {
 await ensureFolders();
 const added: string[] = [];
 for (const fp of filePaths || []) {
 const ext = path.extname(fp).slice(1).toLowerCase();
 if (!MOD_EXTENSIONS.includes(ext)) continue;
 const dest = path.join(modsDir(), path.basename(fp));
 try { await fsp.copyFile(fp, dest); added.push(path.basename(fp)); } catch { /* skip */ }
 }
 return added;
}

ipcMain.handle("app:autoFindBasePak", async () => {
 const found = await findBasePak();
 if (!found) return { found: false };
 await ensureFolders();
 const dest = path.join(libsDir(), "data0.pak");
 await fsp.copyFile(found, dest);
 return { found: true, source: found };
});

ipcMain.handle("app:selectMods", async () => {
 if (!mainWindow) return [];
 const res = await dialog.showOpenDialog(mainWindow, {
 title: "Выберите моды",
 properties: ["openFile", "multiSelections"],
 filters: [{ name: "Моды", extensions: MOD_EXTENSIONS }],
 });
 if (res.canceled || res.filePaths.length === 0) return [];
 return copyMods(res.filePaths);
});

ipcMain.handle("app:addModFiles", async (_e, filePaths: string[]) => copyMods(filePaths));

ipcMain.handle("app:deleteMod", async (_e, name: string) => {
 const target = path.join(modsDir(), path.basename(name));
 try { await fsp.rm(target, { force: true }); return true; } catch { return false; }
});

ipcMain.handle("app:openPath", async (_e, which: string) => {
 const target = which === "mods" ? modsDir() : which === "output" ? outputDir() : libsDir();
 await ensureFolders();
 await shell.openPath(target);
 return true;
});

ipcMain.handle("app:importBasePak", async () => {
 if (!mainWindow) return null;
 const res = await dialog.showOpenDialog(mainWindow, {
 title: "Select data0.pak",
 properties: ["openFile"],
 filters: [{ name: "Game data", extensions: ["pak", "mpak"] }],
 });
 if (res.canceled || res.filePaths.length === 0) return null;
 await ensureFolders();
 const src = res.filePaths[0];
 const dest = path.join(libsDir(), path.basename(src));
 await fsp.copyFile(src, dest);
 return path.basename(src);
});

ipcMain.on("merge:conflictResolve", (_e, data: { id: number; choice: number }) => {
 const resolver = pendingConflicts.get(data.id);
 if (resolver) {
 pendingConflicts.delete(data.id);
 resolver(data.choice);
 }
});

ipcMain.handle("merge:run", async (_e, options: { globalFix: boolean; codeConflict: string; assetConflict: string }) => {
 if (merging) {
 throw new Error("A merge is already running");
 }
 merging = true;
 pendingConflicts.clear();
 try {
 const host = makeHost(options);
 const output = path.join(outputDir(), "data2.pak");
 const engine = new MergeEngine({
 baseDir: libsDir(),
 modsDir: modsDir(),
 outputPath: output,
 globalFix: !!options.globalFix,
 host,
 });
 const summary = await engine.run();
 return summary;
 } finally {
 merging = false;
 pendingConflicts.clear();
 }
});

void app.whenReady().then(async () => {
 createWindow();
 if (process.env.SMM_SMOKE === "1") {
 mainWindow?.webContents.on("console-message", (_e, _lvl, message) => console.log("RENDERER_CONSOLE: " + message));
 mainWindow?.webContents.on("did-finish-load", () => console.log("RENDERER_LOADED"));
 mainWindow?.webContents.on("did-fail-load", (_e, code, desc) => console.log("RENDERER_FAIL: " + code + " " + desc));
 const status = await buildStatus();
 console.log("SMOKE_OK status=" + JSON.stringify(status));
 setTimeout(() => app.quit(), 3500);
 }
 if (process.env.SMM_SMOKE_MERGE === "1") {
 try {
 await runMergeSmoke();
 console.log("SMOKE_MERGE_OK");
 } catch (e) {
 console.log("SMOKE_MERGE_FAIL " + String(e));
 }
 setTimeout(() => app.quit(), 500);
 }
 app.on("activate", () => {
 if (BrowserWindow.getAllWindows().length === 0) createWindow();
 });
});

app.on("window-all-closed", () => {
 if (process.platform !== "darwin") app.quit();
});
