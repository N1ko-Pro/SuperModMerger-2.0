import type { CommonTokenStream } from "antlr4ng";
import { BaseTreeNode } from "../../core/baseTreeNode.js";

/** Leaf statement node (import, export, variable, macro, use, etc.). */
export class ScrLeafNode extends BaseTreeNode {}

/** Function-call node, carries its argument texts for comparison. */
export class ScrFunCallNode extends BaseTreeNode {
 readonly args: string[];
 constructor(
 signature: string,
 startTokenIndex: number,
 stopTokenIndex: number,
 line: number,
 tokenStream: CommonTokenStream,
 args: string[]
 ) {
 super(signature, startTokenIndex, stopTokenIndex, line, tokenStream);
 this.args = args;
 }
}

/** Container node (root, sub/function block, if/else-if/else). Children keyed by signature, insertion order preserved. */
export class ScrContainerNode extends BaseTreeNode {
 readonly args: string[];
 readonly children = new Map<string, BaseTreeNode>();
 constructor(
 signature: string,
 startTokenIndex: number,
 stopTokenIndex: number,
 lineNumber: number,
 tokenStream: CommonTokenStream,
 args: string[] = []
 ) {
 super(signature, startTokenIndex, stopTokenIndex, lineNumber, tokenStream);
 this.args = args;
 }
 addChild(node: BaseTreeNode): void {
 this.children.set(node.signature, node);
 }
}
