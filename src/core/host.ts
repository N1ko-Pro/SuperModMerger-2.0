export type LogLevel = "info" | "success" | "warning" | "error" | "debug";

export type CodeConflictPolicy = "incoming" | "base";
export type AssetConflictPolicy = "first" | "last" | "largest" | "smallest";

export interface CodeConflictRequest {
 file: string;
 signature: string;
 baseModName: string;
 baseLine: number;
 baseText: string;
 incomingModName: string;
 incomingLine: number;
 incomingText: string;
}

export interface AssetConflictRequest {
 path: string;
 options: string[];
}

/**
 * The engine talks to the outside world (GUI or CLI) only through this host:
 * logging, progress, structured events and (optionally) interactive conflict
 * resolution. If interactive resolvers are not provided, the configured
 * policies are used instead, so the engine never blocks.
 */
export interface EngineHost {
 log(level: LogLevel, message: string): void;
 progress(current: number, total: number, file: string): void;
 event(type: string, payload: Record<string, unknown>): void;
 codeConflictPolicy: CodeConflictPolicy;
 assetConflictPolicy: AssetConflictPolicy;
 resolveCodeConflict?(req: CodeConflictRequest): Promise<number>;
 resolveAssetConflict?(req: AssetConflictRequest): Promise<number>;
}

/** Minimal host used for tests and the CLI path. */
export class ConsoleHost implements EngineHost {
 codeConflictPolicy: CodeConflictPolicy = "incoming";
 assetConflictPolicy: AssetConflictPolicy = "largest";
 quiet: boolean;
 constructor(quiet = false) {
 this.quiet = quiet;
 }
 log(level: LogLevel, message: string): void {
 if (!this.quiet) {
 console.log("[" + level + "] " + message);
 }
 }
 progress(_current: number, _total: number, _file: string): void {
 // no-op by default
 }
 event(_type: string, _payload: Record<string, unknown>): void {
 // no-op by default
 }
}
