import { BaseTreeNode } from "../../core/baseTreeNode.js";

export class JsonLeafNode extends BaseTreeNode {}

export class JsonPairNode extends BaseTreeNode {
 value: BaseTreeNode | null = null;
}

export class JsonContainerNode extends BaseTreeNode {
 readonly children = new Map<string, BaseTreeNode>();
 addChild(node: BaseTreeNode): void {
 this.children.set(node.signature, node);
 }
}

export class JsonArrayNode extends BaseTreeNode {
 private readonly elements: BaseTreeNode[] = [];
 addElement(node: BaseTreeNode): void {
 this.elements.push(node);
 }
 getElements(): BaseTreeNode[] {
 return this.elements;
 }
}
