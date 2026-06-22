import type { CommonTokenStream } from "antlr4ng";
import { BaseTreeNode } from "../../core/baseTreeNode.js";

/** Base XML node with cleaned attribute map. */
export abstract class XmlNode extends BaseTreeNode {
 attributes: Map<string, string>;
 constructor(
 signature: string,
 startTokenIndex: number,
 stopTokenIndex: number,
 line: number,
 tokenStream: CommonTokenStream,
 attributes: Map<string, string>
 ) {
 super(signature, startTokenIndex, stopTokenIndex, line, tokenStream);
 this.attributes = attributes;
 }
}

export class XmlLeafNode extends XmlNode {}

export class XmlContainerNode extends XmlNode {
 readonly children = new Map<string, XmlNode>();
 addChild(node: XmlNode): void {
 this.children.set(node.signature, node);
 }
}
