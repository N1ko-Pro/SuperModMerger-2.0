import { TokenStreamRewriter } from "antlr4ng";
import { JSONLexer } from "../../antlr/json/JSONLexer.js";
import { JSONParser } from "../../antlr/json/JSONParser.js";
import type { JsonContext } from "../../antlr/json/JSONParser.js";
import { AbstractFileMerger } from "../abstractMerger.js";
import type { MergeFile } from "../abstractMerger.js";
import { BaseTreeNode } from "../../core/baseTreeNode.js";
import type { ParsedResult, MergeResult } from "../../core/parseResult.js";
import { UserChoice } from "../../core/conflict.js";
import type { ConflictRecord } from "../../core/conflict.js";
import { resolveConflicts } from "../../core/conflictResolver.js";
import { JsonContainerNode, JsonArrayNode, JsonPairNode } from "./nodes.js";
import { JsonFileVisitor } from "./jsonVisitor.js";

interface NewNodeRecord {
 parentContainer: BaseTreeNode;
 previousSibling: BaseTreeNode | null;
 newNode: BaseTreeNode;
}

function rec(
 fileName: string, baseModName: string, mergeModName: string, signature: string,
 baseNode: BaseTreeNode, modNode: BaseTreeNode, userChoice: UserChoice | null = null
): ConflictRecord {
 return { fileName, baseModName, mergeModName, signature, baseNode, modNode, userChoice };
}

/** JSON / .gui merger (recursive object & array diff with smart conflict detection). */
export class JsonFileMerger extends AbstractFileMerger {
 private conflicts: ConflictRecord[] = [];
 private newNodes: NewNodeRecord[] = [];
 private vanillaRootNode: BaseTreeNode | null = null;

 async merge(accumulatedFile: MergeFile, incomingModFile: MergeFile): Promise<MergeResult> {
 try {
 const vanilla = await this.context.baseManager.parseForm<BaseTreeNode>(
 accumulatedFile.entryName,
 (content) => this.parseContent(content).astNode
 );
 if (vanilla) this.vanillaRootNode = vanilla;
 const baseResult = this.parseContent(accumulatedFile.content);
 const modResult = this.parseContent(incomingModFile.content);
 this.deepCompare(this.vanillaRootNode, baseResult.astNode, modResult.astNode);
 if (this.context.isFirstMerge && this.conflicts.length > 0) {
 for (const record of this.conflicts) record.userChoice = UserChoice.MERGE_MOD;
 } else if (this.conflicts.length > 0) {
 await resolveConflicts(this.conflicts, this.context);
 }
 return { mergedContent: this.getMergedContent(baseResult), mergedHistory: this.context.mergedHistory };
 } catch (e) {
 this.context.host.log("error", "JSON merge failed for " + accumulatedFile.name + ": " + String(e));
 throw e;
 } finally {
 this.conflicts = [];
 this.newNodes = [];
 this.vanillaRootNode = null;
 }
 }

 private deepCompare(originalNode: BaseTreeNode | null, baseNode: BaseTreeNode, modNode: BaseTreeNode): void {
 if (baseNode instanceof JsonContainerNode && modNode instanceof JsonContainerNode) {
 this.compareContainers(originalNode instanceof JsonContainerNode ? originalNode : null, baseNode, modNode);
 } else if (baseNode instanceof JsonArrayNode && modNode instanceof JsonArrayNode) {
 this.compareArrays(originalNode instanceof JsonArrayNode ? originalNode : null, baseNode, modNode);
 } else {
 this.compareLeafNodes(originalNode, baseNode, modNode);
 }
 }

 private pairValue(node: BaseTreeNode | null): BaseTreeNode | null {
 return node instanceof JsonPairNode ? node.value : null;
 }

 private compareContainers(originalContainer: JsonContainerNode | null, baseContainer: JsonContainerNode, modContainer: JsonContainerNode): void {
 let previousSiblingInBase: BaseTreeNode | null = null;
 for (const [signature, modChild] of modContainer.children) {
 const originalChild = originalContainer?.children.get(signature) ?? null;
 const baseChild = baseContainer.children.get(signature) ?? null;
 if (baseChild === null) {
 this.newNodes.push({ parentContainer: baseContainer, previousSibling: previousSiblingInBase, newNode: modChild });
 } else {
 previousSiblingInBase = baseChild;
 if (modChild instanceof JsonPairNode && baseChild instanceof JsonPairNode) {
 const modValue = modChild.value;
 const baseValue = baseChild.value;
 if (modValue !== null && baseValue !== null) {
 if (baseValue instanceof JsonContainerNode && modValue instanceof JsonContainerNode) {
 this.deepCompare(this.pairValue(originalChild), baseValue, modValue);
 } else if (baseValue instanceof JsonArrayNode && modValue instanceof JsonArrayNode) {
 this.deepCompare(this.pairValue(originalChild), baseValue, modValue);
 } else if (baseValue.sourceText !== modValue.sourceText) {
 const originalValue = this.pairValue(originalChild);
 if (originalValue === null || originalValue.sourceText !== modValue.sourceText) {
 if (originalValue !== null && originalValue.sourceText === baseValue.sourceText) {
 const record = rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, baseChild.signature, baseChild, modChild);
 record.userChoice = UserChoice.MERGE_MOD;
 this.conflicts.push(record);
 } else {
 this.conflicts.push(rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, baseChild.signature, baseChild, modChild));
 }
 }
 }
 }
 } else {
 this.deepCompare(originalChild, baseChild, modChild);
 }
 }
 }
 }

 private compareArrays(originalArray: JsonArrayNode | null, baseArray: JsonArrayNode, modArray: JsonArrayNode): void {
 const baseElements = baseArray.getElements();
 const modElements = modArray.getElements();
 if (baseElements.length !== modElements.length) {
 if (!this.isNodeSameAsOriginalBaseMod(originalArray, modArray)) {
 this.conflicts.push(rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, baseArray.signature, baseArray, modArray));
 }
 } else {
 for (let i = 0; i < baseElements.length; i++) {
 const originalElement = originalArray ? (originalArray.getElements()[i] ?? null) : null;
 this.deepCompare(originalElement, baseElements[i], modElements[i]);
 }
 }
 }

 private compareLeafNodes(originalNode: BaseTreeNode | null, baseNode: BaseTreeNode, modNode: BaseTreeNode): void {
 if (baseNode.sourceText !== modNode.sourceText) {
 if (!this.isNodeSameAsOriginalBaseMod(originalNode, modNode)) {
 this.conflicts.push(rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, baseNode.signature, baseNode, modNode));
 }
 }
 }

 private isNodeSameAsOriginalBaseMod(originalNode: BaseTreeNode | null, modNode: BaseTreeNode): boolean {
 if (originalNode === null) return false;
 return originalNode.sourceText === modNode.sourceText;
 }

 private getMergedContent(baseResult: ParsedResult<BaseTreeNode>): string {
 const rewriter = new TokenStreamRewriter(baseResult.tokenStream);
 for (const c of this.conflicts) {
 if (c.userChoice === UserChoice.MERGE_MOD) {
 rewriter.replace(c.baseNode.startTokenIndex, c.baseNode.stopTokenIndex, c.modNode.sourceText);
 }
 }
 for (const record of this.newNodes) {
 const parentContainer = record.parentContainer;
 const newNode = record.newNode;
 const previousSibling = record.previousSibling;
 if (previousSibling !== null) {
 rewriter.insertAfter(previousSibling.stopTokenIndex, this.buildInsertText(newNode, false));
 } else if (parentContainer instanceof JsonContainerNode || parentContainer instanceof JsonArrayNode) {
 rewriter.insertAfter(parentContainer.startTokenIndex, this.buildInsertText(newNode, true));
 }
 }
 return rewriter.getText();
 }

 private buildInsertText(newNode: BaseTreeNode, isFirstChild: boolean): string {
 const nodeText = newNode.sourceText;
 return isFirstChild ? "\n " + nodeText : ",\n " + nodeText;
 }

 private parseContent(content: string): ParsedResult<BaseTreeNode> {
 return this.parseWithTemplate<BaseTreeNode, JSONLexer, JSONParser, JsonContext>(
 content,
 (input) => new JSONLexer(input),
 (tokens) => new JSONParser(tokens),
 (parser) => parser.json(),
 (tokenStream, tree) => new JsonFileVisitor(tokenStream).visit(tree)!
 );
 }
}
