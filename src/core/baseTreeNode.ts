import { CommonTokenStream } from "antlr4ng";

/**
 * Base AST node. Holds the token-index span and computes the original source
 * text lazily from the char stream (mirrors the original BaseTreeNode).
 */
export abstract class BaseTreeNode {
 signature: string;
 readonly startTokenIndex: number;
 readonly stopTokenIndex: number;
 readonly lineNumber: number;
 readonly tokenStream: CommonTokenStream;
 private _sourceText: string | undefined;

 constructor(
 signature: string,
 startTokenIndex: number,
 stopTokenIndex: number,
 lineNumber: number,
 tokenStream: CommonTokenStream
 ) {
 this.signature = signature;
 this.startTokenIndex = startTokenIndex;
 this.stopTokenIndex = stopTokenIndex;
 this.lineNumber = lineNumber;
 this.tokenStream = tokenStream;
 }

 get sourceText(): string {
 if (this._sourceText === undefined) {
 try {
 const startTok = this.tokenStream.get(this.startTokenIndex);
 const stopTok = this.tokenStream.get(this.stopTokenIndex);
 const cs = startTok.inputStream;
 this._sourceText = cs ? cs.getTextFromRange(startTok.start, stopTok.stop) : "";
 } catch {
 this._sourceText = "";
 }
 }
 return this._sourceText;
 }
}
