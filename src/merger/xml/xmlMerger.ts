import { TokenStreamRewriter } from "antlr4ng";
import type { DocumentContext } from "../../antlr/xml/TechlandXMLParser.js";
import { TechlandXMLLexer } from "../../antlr/xml/TechlandXMLLexer.js";
import { TechlandXMLParser } from "../../antlr/xml/TechlandXMLParser.js";
import { AbstractFileMerger } from "../abstractMerger.js";
import type { MergeFile } from "../abstractMerger.js";
import type { ParsedResult, MergeResult } from "../../core/parseResult.js";
import { UserChoice } from "../../core/conflict.js";
import type { ConflictRecord } from "../../core/conflict.js";
import { BaseTreeNode } from "../../core/baseTreeNode.js";
import { resolveConflicts } from "../../core/conflictResolver.js";
import { XmlNode, XmlContainerNode, XmlLeafNode } from "./nodes.js";
import { XmlFileVisitor } from "./xmlVisitor.js";

interface XmlNewNode {
 parentContainer: XmlContainerNode;
 previousSibling: XmlNode | null;
 newNode: XmlNode;
}

function mapsEqual(a: Map<string, string>, b: Map<string, string>): boolean {
 if (a.size !== b.size) return false;
 for (const [k, v] of a) {
 if (b.get(k) !== v) return false;
 }
 return true;
}

function rec(
 fileName: string, baseModName: string, mergeModName: string, signature: string,
 baseNode: BaseTreeNode, modNode: BaseTreeNode, userChoice: UserChoice | null = null
): ConflictRecord {
 return { fileName, baseModName, mergeModName, signature, baseNode, modNode, userChoice };
}

/** XML / GUI-markup merger (3-way attribute diff + node insertion). */
export class XmlFileMerger extends AbstractFileMerger {
 private conflicts: ConflictRecord[] = [];
 private newNodes: XmlNewNode[] = [];
 private vanillaRootNode: XmlContainerNode | null = null;

 async merge(accumulatedFile: MergeFile, incomingModFile: MergeFile): Promise<MergeResult> {
 try {
 const vanilla = await this.context.baseManager.parseForm<XmlContainerNode>(
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
 this.context.host.log("error", "XML merge failed for " + accumulatedFile.name + ": " + String(e));
 throw e;
 } finally {
 this.conflicts = [];
 this.newNodes = [];
 this.vanillaRootNode = null;
 }
 }

 private deepCompare(
 vanillaContainer: XmlContainerNode | null,
 accumulatedContainer: XmlContainerNode,
 incomingModContainer: XmlContainerNode
 ): void {
 let previousSiblingInBase: XmlNode | null = null;
 for (const [signature, modNode] of incomingModContainer.children) {
 try {
 let vanillaNode: XmlNode | null = null;
 if (vanillaContainer) vanillaNode = vanillaContainer.children.get(signature) ?? null;
 const accumulatedNode = accumulatedContainer.children.get(signature) ?? null;
 if (accumulatedNode === null) {
 this.newNodes.push({ parentContainer: accumulatedContainer, previousSibling: previousSiblingInBase, newNode: modNode });
 } else {
 previousSiblingInBase = accumulatedNode;
 if (accumulatedNode instanceof XmlContainerNode && modNode instanceof XmlContainerNode) {
 this.deepCompare(vanillaNode instanceof XmlContainerNode ? vanillaNode : null, accumulatedNode, modNode);
 } else if (accumulatedNode instanceof XmlLeafNode && modNode instanceof XmlLeafNode) {
 if (!mapsEqual(accumulatedNode.attributes, modNode.attributes)) {
 if (!this.isNodeSameAsOriginalBaseMod(vanillaNode, modNode)) {
 if (this.isNodeSameAsOriginalBaseMod(vanillaNode, accumulatedNode)) {
 this.context.mergedHistory.markSignature(incomingModContainer.signature + "-" + signature, this.context.mergeModName);
 const record = rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, modNode);
 record.userChoice = UserChoice.MERGE_MOD;
 this.conflicts.push(record);
 } else {
 const modName = this.context.mergedHistory.getModNameFromSignature(incomingModContainer.signature + "-" + signature);
 this.conflicts.push(rec(this.context.mergingFileName, modName ?? this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, modNode));
 }
 }
 }
 } else {
 if (!this.isNodeSameAsOriginalBaseMod(vanillaNode, modNode)) {
 this.conflicts.push(rec(this.context.mergingFileName, this.context.accumulatedModName, this.context.mergeModName, signature, accumulatedNode, modNode));
 }
 }
 }
 } catch (e) {
 this.context.host.log("error", "Error processing XML node " + signature + ": " + String(e));
 }
 }
 }

 private getMergedContent(baseResult: ParsedResult<XmlContainerNode>): string {
 const rewriter = new TokenStreamRewriter(baseResult.tokenStream);
 for (const record of this.conflicts) {
 if (record.userChoice === UserChoice.MERGE_MOD) {
 rewriter.replace(record.baseNode.startTokenIndex, record.baseNode.stopTokenIndex, record.modNode.sourceText);
 }
 }
 for (const record of this.newNodes) {
 const previousSibling = record.previousSibling;
 const newNode = record.newNode;
 if (previousSibling !== null) {
 rewriter.insertBefore(previousSibling.stopTokenIndex + 1, "\n" + newNode.sourceText);
 } else {
 let stopTokenIndex = record.parentContainer.stopTokenIndex;
 while (record.parentContainer.tokenStream.get(stopTokenIndex).type !== TechlandXMLLexer.OPEN) {
 stopTokenIndex--;
 }
 rewriter.insertBefore(stopTokenIndex, newNode.sourceText + "\n");
 }
 }
 return rewriter.getText();
 }

 private isNodeSameAsOriginalBaseMod(originalNode: XmlNode | null, modNode: XmlNode): boolean {
 if (this.vanillaRootNode === null) return false;
 if (originalNode === null) return false;
 return mapsEqual(modNode.attributes, originalNode.attributes);
 }

 private parseContent(content: string): ParsedResult<XmlContainerNode> {
 return this.parseWithTemplate<XmlContainerNode, TechlandXMLLexer, TechlandXMLParser, DocumentContext>(
 content,
 (input) => new TechlandXMLLexer(input),
 (tokens) => new TechlandXMLParser(tokens),
 (parser) => parser.document(),
 (tokenStream, tree) => new XmlFileVisitor(tokenStream).visitDocument(tree) as XmlContainerNode
 );
 }
}
