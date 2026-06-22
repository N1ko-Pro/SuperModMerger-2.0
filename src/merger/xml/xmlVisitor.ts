import type { CommonTokenStream, ParserRuleContext } from "antlr4ng";
import { TechlandXMLParserVisitor } from "../../antlr/xml/TechlandXMLParserVisitor.js";
import type { DocumentContext, ElementContext, AttributeContext } from "../../antlr/xml/TechlandXMLParser.js";
import { XmlNode, XmlContainerNode, XmlLeafNode } from "./nodes.js";

const PRIORITY_ATTRIBUTE_NAMES = ["id", "uid", "name", "key", "Name", "type", "property_id", "class"];
const ELEMENT = "element";

/** Builds the XML AST tree. Element signatures use an identifying attribute when available. */
export class XmlFileVisitor extends TechlandXMLParserVisitor<XmlNode> {
 private readonly ts: CommonTokenStream;
 constructor(tokenStream: CommonTokenStream) {
 super();
 this.ts = tokenStream;
 }

 private startIdx(ctx: ParserRuleContext): number { return ctx.start!.tokenIndex; }
 private stopIdx(ctx: ParserRuleContext): number { return ctx.stop!.tokenIndex; }
 private line(ctx: ParserRuleContext): number { return ctx.start!.line; }

 visitDocument = (ctx: DocumentContext): XmlNode => {
 const root = new XmlContainerNode("ROOT", this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts, new Map<string, string>());
 let index = 0;
 for (const eleCtx of ctx.element()) {
 root.addChild(this.visitElementIndexed(eleCtx, index++));
 }
 return root;
 };

 visitElement = (ctx: ElementContext): XmlNode => {
 return this.visitElementIndexed(ctx, 0);
 };

 private visitElementIndexed(ctx: ElementContext, index: number): XmlNode {
 const tagName = ctx.Name(0)!.getText();
 const attributes = ctx.attribute();
 const cleanAttributes = new Map<string, string>();
 let identifyingAttr: string | null = null;
 if (attributes) {
 for (const attrCtx of attributes) {
 const attrKey = attrCtx.Name().getText();
 const attrValue = attrCtx.STRING().getText();
 cleanAttributes.set(attrKey, this.normalizeValue(attrValue));
 }
 identifyingAttr = this.extractIdentifyingAttribute(attributes);
 }
 const signature = this.buildSignature(tagName, identifyingAttr, index);
 const content = ctx.content();
 if (content !== null && content.element().length > 0) {
 const containerNode = new XmlContainerNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts, cleanAttributes);
 let childIndex = 0;
 for (const childCtx of content.element()) {
 containerNode.addChild(this.visitElementIndexed(childCtx, childIndex++));
 }
 return containerNode;
 }
 return new XmlLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts, cleanAttributes);
 }

 private stripQuotes(s: string): string {
 let r = s;
 if (r.length > 0) {
 const f = r.charCodeAt(0);
 if (f === 34 || f === 39) r = r.substring(1);
 }
 if (r.length > 0) {
 const l = r.charCodeAt(r.length - 1);
 if (l === 34 || l === 39) r = r.substring(0, r.length - 1);
 }
 return r;
 }

 private extractIdentifyingAttribute(attributes: AttributeContext[]): string | null {
 if (attributes.length === 0) return null;
 for (const priorityName of PRIORITY_ATTRIBUTE_NAMES) {
 for (const attr of attributes) {
 const attrName = attr.Name().getText();
 if (priorityName === attrName) {
 return attrName + "=" + this.stripQuotes(attr.STRING().getText());
 }
 }
 }
 const sorted = [...attributes].sort((a, b) => {
 const an = a.Name().getText();
 const bn = b.Name().getText();
 return an < bn ? -1 : an > bn ? 1 : 0;
 });
 const parts: string[] = [];
 for (const attr of sorted) {
 parts.push(attr.Name().getText() + "=" + this.stripQuotes(attr.STRING().getText()));
 }
 return parts.length > 0 ? parts.join(",") : null;
 }

 private buildSignature(tagName: string, identifyingAttr: string | null, index: number): string {
 if (identifyingAttr && identifyingAttr.length > 0) {
 return ELEMENT + ":" + tagName + ":" + identifyingAttr;
 }
 return ELEMENT + ":" + tagName + ":" + index;
 }

 private normalizeValue(raw: string | null): string {
 if (raw === null) return "";
 let value = raw.trim();
 if (value.length >= 2) {
 const firstCode = value.charCodeAt(0);
 const lastCode = value.charCodeAt(value.length - 1);
 if ((firstCode === 34 && lastCode === 34) || (firstCode === 39 && lastCode === 39)) {
 value = value.substring(1, value.length - 1);
 }
 }
 return value.trim();
 }
}
