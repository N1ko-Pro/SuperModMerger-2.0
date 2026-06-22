import { contextBridge, ipcRenderer } from "electron";
import type { IpcRendererEvent } from "electron";

contextBridge.exposeInMainWorld("api", {
 getStatus: () => ipcRenderer.invoke("app:getStatus"),
 openPath: (which: string) => ipcRenderer.invoke("app:openPath", which),
 importBasePak: () => ipcRenderer.invoke("app:importBasePak"),
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
});
