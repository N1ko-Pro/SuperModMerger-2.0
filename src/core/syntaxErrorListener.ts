import { BaseErrorListener } from "antlr4ng";
import type { MergerContext } from "./mergerContext.js";

/** Reports parser syntax issues as warnings through the engine host. */
export class SyntaxErrorListener extends BaseErrorListener {
 private readonly context: MergerContext;
 constructor(context: MergerContext) {
 super();
 this.context = context;
 }
 syntaxError(
 _recognizer: unknown,
 _offendingSymbol: unknown,
 line: number,
 column: number,
 msg: string,
 _e: unknown
 ): void {
 this.context.host.event("report", {
 level: "warning",
 source: this.context.mergeModName,
 message: "Syntax warning in " + this.context.mergingFileName + " at " + line + ":" + column + " " + msg,
 });
 }
}
