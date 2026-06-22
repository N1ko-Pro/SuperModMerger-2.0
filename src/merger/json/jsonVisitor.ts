import type { CommonTokenStream, ParserRuleContext } from "antlr4ng";
import { JSONVisitor } from "../../antlr/json/JSONVisitor.js";
import type { JsonContext, ObjContext, PairContext, ArrContext, ValueContext } from "../../antlr/json/JSONParser.js";
import { BaseTreeNode } from "../../core/baseTreeNode.js";
import { JsonContainerNode, JsonArrayNode, JsonPairNode, JsonLeafNode } from "./nodes.js";

const OBJECT = "OBJECT";
const ARRAY = "ARRAY";
const VALUE = "value";

/** Builds the JSON AST tree (objects as keyed containers, arrays positional). */
export class JsonFileVisitor extends JSONVisitor<BaseTreeNode> {
 private readonly ts: CommonTokenStream;
 constructor(tokenStream: CommonTokenStream) {
 super();
 this.ts = tokenStream;
 }
 private startIdx(ctx: ParserRuleContext): number { return ctx.start!.tokenIndex; }
 private stopIdx(ctx: ParserRuleContext): number { return ctx.stop!.tokenIndex; }
 private line(ctx: ParserRuleContext): number { return ctx.start!.line; }

 visitJson = (ctx: JsonContext): BaseTreeNode => {
 return this.visit(ctx.value())!;
 };

 visitObj = (ctx: ObjContext): BaseTreeNode => {
 const objNode = new JsonContainerNode(OBJECT, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 for (const pairCtx of ctx.pair()) {
 const pairNode = this.visit(pairCtx);
 if (pairNode) objNode.addChild(pairNode);
 }
 return objNode;
 };

 visitPair = (ctx: PairContext): BaseTreeNode => {
 const key = this.stripDquotes(ctx.STRING().getText());
 const pairNode = new JsonPairNode("pair:" + key, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 pairNode.value = this.visit(ctx.value());
 return pairNode;
 };

 visitArr = (ctx: ArrContext): BaseTreeNode => {
 const arrNode = new JsonArrayNode(ARRAY, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 for (const valueCtx of ctx.value()) {
 const el = this.visit(valueCtx);
 if (el) arrNode.addElement(el);
 }
 return arrNode;
 };

 visitValue = (ctx: ValueContext): BaseTreeNode => {
 const obj = ctx.obj();
 if (obj) return this.visit(obj)!;
 const arr = ctx.arr();
 if (arr) return this.visit(arr)!;
 const str = ctx.STRING();
 if (str) return this.createLeaf(ctx, str.getText());
 const num = ctx.NUMBER();
 if (num) return this.createLeaf(ctx, num.getText());
 return this.createLeaf(ctx, ctx.getText());
 };

 private createLeaf(ctx: ValueContext, value: string): BaseTreeNode {
 return new JsonLeafNode(VALUE + ":" + value, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 }

 private stripDquotes(s: string): string {
 if (s.length >= 2 && s.charCodeAt(0) === 34 && s.charCodeAt(s.length - 1) === 34) {
 return s.substring(1, s.length - 1);
 }
 return s;
 }
}
