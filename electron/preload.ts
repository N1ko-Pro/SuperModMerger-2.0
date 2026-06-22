import { contextBridge, ipcRenderer, webUtils } from "electron";
import type { IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("api", {
 getStatus: () => ipcRenderer.invoke("app:getStatus"),
 openPath: (which: string) => ipcRenderer.invoke("app:openPath", which),
 importBasePak: () => ipcRenderer.invoke("app:importBasePak"),
 autoFindBasePak: () => ipcRenderer.invoke("app:autoFindBasePak"),
 selectMods: () => ipcRenderer.invoke("app:selectMods"),
 addModFiles: (paths: string[]) => ipcRenderer.invoke("app:addModFiles", paths),
 deleteMod: (name: string) => ipcRenderer.invoke("app:deleteMod", name),
 getPathForFile: (file: File) => webUtils.getPathForFile(file),
 runMerge: (options: unknown) => ipcRenderer.invoke("merge:run", options),
 resolveConflict: (id: number, choice: number) => ipcRenderer.send("merge:conflictResolve", { id, choice }),
 onEvent: (cb: (evt: unknown) => void) => {
 const listener = (_e: IpcRendererEvent, evt: unknown) => cb(evt);
 ipcRenderer.on("merge:event", listener);
 return () => ipcRenderer.removeListener("merge:event", listener);
 },
 onConflict: (cb: (req: unknown) => void) => {
 const listener = (_e: IpcRendererEvent, req: unknown) => cb(req);
 ipcRenderer.on("merge:conflict", listener);
 return () => ipcRenderer.removeListener("merge:conflict", listener);
 },
 winMinimize: () => ipcRenderer.send("win:minimize"),
 winMaximize: () => ipcRenderer.send("win:maximize"),
 winClose: () => ipcRenderer.send("win:close"),
 onWinState: (cb: (state: { maximized: boolean }) => void) => {
 const listener = (_e: IpcRendererEvent, state: { maximized: boolean }) => cb(state);
 ipcRenderer.on("win:state", listener);
 return () => ipcRenderer.removeListener("win:state", listener);
 },
});
