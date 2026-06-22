import { TokenStreamRewriter } from "antlr4ng";
import type { FileContext } from "../../antlr/scr/TechlandScriptParser.js";
import { TechlandScriptLexer } from "../../antlr/scr/TechlandScriptLexer.js";
import { TechlandScriptParser } from "../../antlr/scr/TechlandScriptParser.js";
import { AbstractFileMerger } from "../abstractMerger.js";
import type { MergeFile } from "../abstractMerger.js";
import { BaseTreeNode } from "../../core/baseTreeNode.js";
import type { ParsedResult, MergeResult } from "../../core/parseResult.js";
import { UserChoice } from "../../core/conflict.js";
import type { ConflictRecord } from "../../core/conflict.js";
import { resolveConflicts } from "../../core/conflictResolver.js";
import { ScrContainerNode, ScrFunCallNode } from "./nodes.js";
import { ScrFileVisitor, SCR } from "./scrVisitor.js";

enum NodeType { IMPORT, SUB, DEFAULT }

interface InsertOperation {
 tokenIndex: number;
 content: string;
 previousSibling: BaseTreeNode | null;
 nodeType: NodeType;
}

function arraysEqual(a: string[], b: string[]): boolean {
 if (a.length !== b.length) return false;
 for (let i = 0; i < a.length; i++) {
 if (a[i] !== b[i]) return false;
 }
 return true;
}

function rec(
 fileName: string, baseModName: string, mergeModName: string, signature: string,
 baseNode: BaseTreeNode, modNode: BaseTreeNode, userChoice: UserChoice | null = null
): ConflictRecord {
 return { fileName, baseModName, mergeModName, signature, baseNode, modNode, userChoice };
}

/** SCR / structured-script merger (3-way AST diff + token rewrite). */
export class ScrFileMerger extends AbstractFileMerger {
 private conflicts: ConflictRecord[] = [];
 private insertOperations: InsertOperation[] = [];
 private vanillaRootNode: ScrContainerNode | null = null;

 async merge(accumulatedFile: MergeFile, incomingModFile: MergeFile): Promise<MergeResult> {
 try {
 const vanilla = await this.context.baseManager.parseForm<ScrContainerNode>(
 accumulatedFile.entryName,
 (content) => this.parseContent(content).astNode
 );
 if (vanilla) this.vanillaRootNode = vanilla;

 const accumulatedResult = this.parseContent(accumulatedFile.content);
 const incomingModResult = this.parseContent(incomingModFile.content);
 this.deepCompare(this.vanillaRootNode, accumulatedResult.astNode, incomingModResult.astNode);

 if (this.context.isFirstMerge && this.conflicts.length > 0) {
 for (const record of this.conflicts) record.userChoice = UserChoice.MERGE_MOD;
 } else if (this.conflicts.length > 0) {
 await resolveConflicts(this.conflicts, this.context);
 }
 return { mergedContent: this.getMergedContent(accumulatedResult), mergedHistory: this.context.mergedHistory };
 } catch (e) {
 this.context.host.log("error", "SCR merge failed for " + accumulatedFile.name + ": " + String(e));
 throw e;
 } finally {
 this.conflicts = [];
 this.insertOperations = [];
 this.vanillaRootNode = null;
 }
 }

 private deepCompare(
 vanillaContainer: ScrContainerNode | null,
 accumulatedContainer: ScrContainerNode,
 incomingModContainer: ScrContainerNode
 ): void {
 let previousSiblingInBase: BaseTreeNode | null = null;
 for (const [signature, incomingModNode] of incomingModContainer.children) {
 try {
 let vanillaNode: BaseTreeNode | null = null;
 if (vanillaContainer) vanillaNode = vanillaContainer.children.get(signature) ?? null;
 const accumulatedNode = accumulatedContainer.children.get(signature) ?? null;
 if (accumulatedNode === null) {
 this.handleInsertion(accumulatedContainer, incomingModNode, previousSiblingInBase);
 } else {
 previousSiblingInBase = accumulatedNode;
 if (accumulatedNode instanceof ScrContainerNode && incomingModNode instanceof ScrContainerNode) {
 this.deepCompare(vanillaNode instanceof ScrContainerNode ? vanillaNode : null, accumulatedNode, incomingModNode);
 } else if (accumulatedNode instanceof ScrFunCallNode && incomingModNode instanceof ScrFunCallNode) {
 if (!arraysEqual(accumulatedNode.args, incomingModNode.args)) {
 if (!this.isNodeSameAsOriginalNode(vanillaNode, incomingModNode)) {
 if (this.isNodeSameAsOriginalNode(vanillaNode, accumulatedNode)) {
 this.context.mergedHistory.markSignature(incomingModContainer.signature + "-" + signature, this.context.mergeModName);
 const record = rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, incomingModNode);
 record.userChoice = UserChoice.MERGE_MOD;
 this.conflicts.push(record);
 } else {
 const modName = this.context.mergedHistory.getModNameFromSignature(incomingModContainer.signature + "-" + signature);
 this.conflicts.push(rec(this.context.mergingFileName, modName ?? this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, incomingModNode));
 }
 }
 }
 } else {
 const accumulatedText = accumulatedNode.sourceText;
 const incomingModText = incomingModNode.sourceText;
 if (!this.equalsTrimmed(accumulatedText, incomingModText)) {
 if (!this.isNodeSameAsOriginalNode(vanillaNode, incomingModNode)) {
 if (this.isNodeSameAsOriginalNode(vanillaNode, accumulatedNode)) {
 this.context.mergedHistory.markSignature(incomingModNode.signature, this.context.mergeModName);
 this.conflicts.push(rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, incomingModNode, UserChoice.MERGE_MOD));
 } else {
 this.conflicts.push(rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, incomingModNode));
 }
 }
 }
 }
 }
 } catch (e) {
 this.context.host.log("error", "Error processing scr node " + signature + ": " + String(e));
 }
 }
 }

 private isNodeSameAsOriginalNode(originalNode: BaseTreeNode | null, incomingModNode: BaseTreeNode): boolean {
 if (this.vanillaRootNode === null) return false;
 if (originalNode === null) return false;
 if (incomingModNode instanceof ScrFunCallNode && originalNode instanceof ScrFunCallNode) {
 return arraysEqual(incomingModNode.args, originalNode.args);
 }
 return this.equalsTrimmed(incomingModNode.sourceText, originalNode.sourceText);
 }

 private handleInsertion(accumulatedContainer: ScrContainerNode, incomingModNode: BaseTreeNode, previousSiblingInBase: BaseTreeNode | null): void {
 let nodeType: NodeType;
 if (incomingModNode.signature.startsWith(SCR.IMPORT)) nodeType = NodeType.IMPORT;
 else if (incomingModNode.signature.startsWith(SCR.SUB_FUN)) nodeType = NodeType.SUB;
 else nodeType = NodeType.DEFAULT;
 let newContent: string;
 let insertPos: number;
 if (nodeType === NodeType.IMPORT) {
 newContent = "\n" + incomingModNode.sourceText;
 insertPos = this.findInsertPositionForImport(accumulatedContainer);
 } else if (nodeType === NodeType.SUB) {
 newContent = incomingModNode.sourceText + "\n";
 insertPos = this.findInsertPositionForSub(accumulatedContainer);
 } else {
 newContent = "\n " + incomingModNode.sourceText;
 insertPos = accumulatedContainer.stopTokenIndex;
 }
 this.insertOperations.push({ tokenIndex: insertPos, content: newContent, previousSibling: previousSiblingInBase, nodeType });
 }

 private findInsertPositionForImport(container: ScrContainerNode): number {
 let lastImportStopIndex: number | null = null;
 for (const node of container.children.values()) {
 if (node.signature.startsWith(SCR.IMPORT + ":")) {
 lastImportStopIndex = node.stopTokenIndex;
 } else {
 return lastImportStopIndex !== null ? lastImportStopIndex + 1 : node.startTokenIndex;
 }
 }
 return lastImportStopIndex !== null ? lastImportStopIndex + 1 : container.stopTokenIndex;
 }

 private findInsertPositionForSub(container: ScrContainerNode): number {
 let lastSubOrImportStopIndex: number | null = null;
 for (const node of container.children.values()) {
 const isSub = node.signature.startsWith(SCR.SUB_FUN + ":");
 const isImport = node.signature.startsWith(SCR.IMPORT + ":");
 if (isSub || isImport) {
 lastSubOrImportStopIndex = node.startTokenIndex;
 } else {
 return lastSubOrImportStopIndex !== null ? lastSubOrImportStopIndex + 1 : node.startTokenIndex;
 }
 }
 return lastSubOrImportStopIndex !== null ? lastSubOrImportStopIndex : container.stopTokenIndex;
 }

 private getMergedContent(accumulatedResult: ParsedResult<ScrContainerNode>): string {
 const rewriter = new TokenStreamRewriter(accumulatedResult.tokenStream);
 for (const record of this.conflicts) {
 if (record.userChoice === UserChoice.MERGE_MOD) {
 rewriter.replace(record.baseNode.startTokenIndex, record.baseNode.stopTokenIndex, record.modNode.sourceText);
 }
 }
 const priority = (t: NodeType): number => (t === NodeType.IMPORT ? 0 : t === NodeType.SUB ? 1 : 2);
 const sorted = [...this.insertOperations].sort((a, b) => {
 const pa = priority(a.nodeType);
 const pb = priority(b.nodeType);
 if (pa !== pb) return pa - pb;
 return a.tokenIndex - b.tokenIndex;
 });
 for (const op of sorted) {
 if (op.previousSibling === null) {
 rewriter.insertBefore(op.tokenIndex, op.content);
 } else {
 rewriter.insertAfter(op.previousSibling.stopTokenIndex, " " + op.content);
 }
 }
 return rewriter.getText();
 }

 private equalsTrimmed(a: string | null, b: string | null): boolean {
 if (a === b) return true;
 if (a === null || b === null) return false;
 return a.replace(/\s+/g, "") === b.replace(/\s+/g, "");
 }

 private parseContent(content: string): ParsedResult<ScrContainerNode> {
 return this.parseWithTemplate<ScrContainerNode, TechlandScriptLexer, TechlandScriptParser, FileContext>(
 content,
 (input) => new TechlandScriptLexer(input),
 (tokens) => new TechlandScriptParser(tokens),
 (parser) => parser.file(),
 (tokenStream, tree) => new ScrFileVisitor(tokenStream).visitFile(tree) as ScrContainerNode
 );
 }
}
