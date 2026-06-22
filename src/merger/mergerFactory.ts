import type { MergerContext } from "../core/mergerContext.js";
import { AbstractFileMerger } from "./abstractMerger.js";
import { ScrFileMerger } from "./scr/scrMerger.js";
import { XmlFileMerger } from "./xml/xmlMerger.js";
import { JsonFileMerger } from "./json/jsonMerger.js";

type MergerFactoryFn = (ctx: MergerContext) => AbstractFileMerger;

const registry = new Map<string, MergerFactoryFn>();

function register(factory: MergerFactoryFn, ...exts: string[]): void {
 for (const ext of exts) registry.set(ext.toLowerCase(), factory);
}

register((ctx) => new ScrFileMerger(ctx), ".scr", ".def", ".loot", ".phx", ".ppfx", ".ares", ".mpcloth", ".gpufx", ".chs", ".scd");
register((ctx) => new XmlFileMerger(ctx), ".xml");
register((ctx) => new JsonFileMerger(ctx), ".gui", ".json");

/** Returns a merger for the file extension, or null for unsupported (binary) files. */
export function getMerger(fileName: string, ctx: MergerContext): AbstractFileMerger | null {
 const idx = fileName.lastIndexOf(".");
 if (idx < 0) return null;
 const ext = fileName.substring(idx).toLowerCase();
 const factory = registry.get(ext);
 return factory ? factory(ctx) : null;
}
