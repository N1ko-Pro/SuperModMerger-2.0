import { CharStream, CommonTokenStream } from "antlr4ng";
import type { Lexer, Parser, ParserRuleContext } from "antlr4ng";
import type { BaseTreeNode } from "../core/baseTreeNode.js";
import type { ParsedResult, MergeResult } from "../core/parseResult.js";
import type { MergerContext } from "../core/mergerContext.js";
import { SyntaxErrorListener } from "../core/syntaxErrorListener.js";

/** Lightweight representation of a file to merge (content + names). */
export interface MergeFile {
 content: string;
 entryName: string;
 name: string;
}

export abstract class AbstractFileMerger {
 protected readonly context: MergerContext;
 constructor(context: MergerContext) {
 this.context = context;
 }

 abstract merge(accumulated: MergeFile, incoming: MergeFile): Promise<MergeResult>;

 /** Shared parse pipeline: build CharStream -> Lexer -> TokenStream -> Parser -> AST. */
 protected parseWithTemplate<T extends BaseTreeNode, L extends Lexer, P extends Parser, PT extends ParserRuleContext>(
 content: string,
 lexerFactory: (input: CharStream) => L,
 parserFactory: (tokens: CommonTokenStream) => P,
 parseTreeFactory: (parser: P) => PT,
 astBuilder: (tokens: CommonTokenStream, tree: PT) => T
 ): ParsedResult<T> {
 const charStream = CharStream.fromString(content);
 const lexer = lexerFactory(charStream);
 const tokenStream = new CommonTokenStream(lexer);
 const parser = parserFactory(tokenStream);
 parser.removeErrorListeners();
 parser.addErrorListener(new SyntaxErrorListener(this.context));
 const tree = parseTreeFactory(parser);
 const astNode = astBuilder(tokenStream, tree);
 return { astNode, tokenStream };
 }
}
