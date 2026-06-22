import type { CommonTokenStream, ParserRuleContext } from "antlr4ng";
import { TechlandScriptVisitor } from "../../antlr/scr/TechlandScriptVisitor.js";
import type {
 FileContext, ImportDeclContext, ExportDeclContext, ExternDeclContext,
 DirectiveCallContext, MacroDeclContext, SubDeclContext, LogicControlDeclContext,
 FunctionBlockContext, VariableDeclContext, VariableAssignDeclContext,
 FunctionCallDeclContext, MethodReferenceFunCallDeclContext, FunctionBlockDeclContext,
 UseDeclContext, UseSemanticDeclContext, ValueListContext,
} from "../../antlr/scr/TechlandScriptParser.js";
import { BaseTreeNode } from "../../core/baseTreeNode.js";
import { ScrContainerNode, ScrFunCallNode, ScrLeafNode } from "./nodes.js";

export const SCR = {
 FUN_CALL: "funCall",
 METHOD_REFERENCE: "methodReference",
 FUN_BLOCK: "funBlock",
 SUB_FUN: "sub",
 VARIABLE: "variable",
 VARIABLE_ASSIGN: "varaibleAssign",
 USE: "use",
 USE_SEMANTIC: "useSemantic",
 IMPORT: "import",
 EXPORT: "export",
 DIRECTIVE: "directive",
 MACRO: "macro",
 EXTERN: "extern",
 IF: "if",
 ELSE_IF: "elseif",
 ELSE: "else",
} as const;

function allDigits(s: string): boolean {
 for (const c of s) {
 if (c < "0" || c > "9") return false;
 }
 return true;
}

/** Builds the SCR AST node tree with stable, conflict-aware signatures. */
export class ScrFileVisitor extends TechlandScriptVisitor<BaseTreeNode> {
 private readonly ts: CommonTokenStream;
 private readonly repeatableFunctions = new Map<string, Set<string>>();
 private currentFunBlockSignature = "ROOT";
 private currentContainerNode: ScrContainerNode | null = null;

 constructor(tokenStream: CommonTokenStream) {
 super();
 this.ts = tokenStream;
 }

 private startIdx(ctx: ParserRuleContext): number {
 return ctx.start!.tokenIndex;
 }
 private stopIdx(ctx: ParserRuleContext): number {
 return ctx.stop!.tokenIndex;
 }
 private line(ctx: ParserRuleContext): number {
 return ctx.start!.line;
 }

 visitFile = (ctx: FileContext): BaseTreeNode => {
 const root = new ScrContainerNode("ROOT", this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 this.currentContainerNode = root;
 for (const def of ctx.definition()) {
 const child = this.visit(def);
 if (child) root.addChild(child);
 }
 return root;
 };

 visitImportDecl = (ctx: ImportDeclContext): BaseTreeNode => {
 const path = ctx.String().getText();
 return new ScrLeafNode(SCR.IMPORT + ":" + path, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitExportDecl = (ctx: ExportDeclContext): BaseTreeNode => {
 const name = ctx.Id().getText();
 return new ScrLeafNode(SCR.EXPORT + ":" + name, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitExternDecl = (ctx: ExternDeclContext): BaseTreeNode => {
 const signature = this.generateFunctionBlockSignature(SCR.EXTERN + ":" + ctx.type().getText() + ":" + ctx.Id().getText());
 return new ScrLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitDirectiveCall = (ctx: DirectiveCallContext): BaseTreeNode => {
 const directiveName = ctx.Id().getText();
 let signature = SCR.DIRECTIVE + ":" + directiveName + ":";
 const valueList = ctx.valueList();
 if (valueList !== null) {
 signature += ":" + valueList.getText();
 }
 return new ScrLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitMacroDecl = (ctx: MacroDeclContext): BaseTreeNode => {
 const signature = SCR.MACRO + ":" + ctx.MacroId().getText();
 return new ScrLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitVariableDecl = (ctx: VariableDeclContext): BaseTreeNode => {
 const signature = this.generateFunctionBlockSignature(SCR.VARIABLE + ":" + ctx.type().getText() + ":" + ctx.Id().getText());
 return new ScrLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitVariableAssignDecl = (ctx: VariableAssignDeclContext): BaseTreeNode => {
 const signature = SCR.VARIABLE_ASSIGN + ":" + ctx.Id().getText() + ":" + ctx.expression().getText();
 return new ScrLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitUseDecl = (ctx: UseDeclContext): BaseTreeNode => {
 const name = ctx.Id().getText();
 let signature = SCR.USE + ":" + name;
 const valueList = ctx.valueList();
 if (valueList !== null) {
 signature += ":" + this.getFullText(valueList);
 }
 return new ScrLeafNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitUseSemanticDecl = (ctx: UseSemanticDeclContext): BaseTreeNode => {
 const semantic = ctx.String().getText();
 return new ScrLeafNode(SCR.USE_SEMANTIC + ":" + semantic, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 };

 visitFunctionCallDecl = (ctx: FunctionCallDeclContext): BaseTreeNode => {
 const funcName = ctx.Id().getText();
 const argsList = this.getValueListTexts(ctx.valueList());
 let signature = SCR.FUN_CALL + ":" + funcName;
 const repeated = this.repeatableFunctions.get(this.currentFunBlockSignature) ?? new Set<string>();
 const children = this.currentContainerNode?.children ?? new Map<string, BaseTreeNode>();
 if (repeated.has(signature)) {
 signature = this.generateFunctionCallSignature(signature, argsList);
 } else if (children.has(signature)) {
 const previousNode = children.get(signature) as ScrFunCallNode;
 repeated.add(SCR.FUN_CALL + ":" + funcName);
 const lastNewSignature = this.generateFunctionCallSignature(signature, previousNode.args);
 previousNode.signature = lastNewSignature;
 children.delete(signature);
 children.set(lastNewSignature, previousNode);
 signature = this.generateFunctionCallSignature(signature, argsList);
 }
 this.repeatableFunctions.set(this.currentFunBlockSignature, repeated);
 return new ScrFunCallNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts, argsList);
 };

 visitMethodReferenceFunCallDecl = (ctx: MethodReferenceFunCallDeclContext): BaseTreeNode => {
 const referenceName = ctx.Id(0)!.getText();
 const funName = ctx.Id(1)!.getText();
 const signature = SCR.METHOD_REFERENCE + ":" + referenceName + ":" + funName;
 return new ScrFunCallNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts, this.getValueListTexts(ctx.valueList()));
 };

 visitSubDecl = (ctx: SubDeclContext): BaseTreeNode => {
 const previousContainer = this.currentContainerNode;
 const signature = this.generateFunctionBlockSignature(SCR.SUB_FUN + ":" + ctx.Id().getText());
 const subNode = new ScrContainerNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 this.currentContainerNode = subNode;
 this.currentFunBlockSignature = signature;
 this.visitFunctionBlockContent(subNode, ctx.functionBlock());
 this.currentContainerNode = previousContainer;
 return subNode;
 };

 visitFunctionBlockDecl = (ctx: FunctionBlockDeclContext): BaseTreeNode => {
 const previousContainer = this.currentContainerNode;
 const previousFunBlockSignature = this.currentFunBlockSignature;
 const funcName = ctx.Id().getText();
 const argsList = this.getValueListTexts(ctx.valueList());
 let signature = SCR.FUN_BLOCK + ":" + funcName;
 const signatures = this.repeatableFunctions.get(this.currentFunBlockSignature) ?? new Set<string>();
 const children = this.currentContainerNode!.children;
 if (signatures.has(signature)) {
 signature = this.generateFunctionBlockArgsSignature(signature, argsList);
 } else if (children.has(signature)) {
 const lastNode = children.get(signature) as ScrContainerNode;
 signatures.add(signature);
 const lastNewSignature = this.generateFunctionBlockArgsSignature(signature, lastNode.args);
 lastNode.signature = lastNewSignature;
 children.delete(signature);
 children.set(lastNewSignature, lastNode);
 signature = this.generateFunctionBlockArgsSignature(signature, argsList);
 }
 this.repeatableFunctions.set(this.currentFunBlockSignature, signatures);
 this.currentFunBlockSignature = signature;
 const funBlockContainer = new ScrContainerNode(signature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts, argsList);
 this.currentContainerNode = funBlockContainer;
 this.visitFunctionBlockContent(funBlockContainer, ctx.functionBlock());
 this.currentContainerNode = previousContainer;
 this.currentFunBlockSignature = previousFunBlockSignature;
 return funBlockContainer;
 };

 visitLogicControlDecl = (ctx: LogicControlDeclContext): BaseTreeNode => {
 const previousContainer = this.currentContainerNode;
 let ifSignature: string = SCR.IF;
 const signatures = this.repeatableFunctions.get(this.currentFunBlockSignature) ?? new Set<string>();
 if (signatures.has(SCR.IF)) {
 const children = this.currentContainerNode!.children;
 let ifIndex = 0;
 for (const key of children.keys()) {
 if (key.startsWith(SCR.IF + ":")) ifIndex++;
 }
 ifSignature = SCR.IF + ":" + ifIndex;
 } else {
 const children = this.currentContainerNode!.children;
 if (children.has(SCR.IF)) {
 const existingIfNode = children.get(SCR.IF)!;
 const existingIfSignature = SCR.IF + ":0";
 existingIfNode.signature = existingIfSignature;
 children.delete(SCR.IF);
 children.set(existingIfSignature, existingIfNode);
 signatures.add(SCR.IF);
 ifSignature = SCR.IF + ":1";
 }
 }
 this.repeatableFunctions.set(this.currentFunBlockSignature, signatures);
 const ifNode = new ScrContainerNode(ifSignature, this.startIdx(ctx), this.stopIdx(ctx), this.line(ctx), this.ts);
 this.currentContainerNode = ifNode;
 this.visitFunctionBlockContent(ifNode, ctx.functionBlock());
 const elseIfClauses = ctx.elseIfClause();
 for (let index = 0; index < elseIfClauses.length; index++) {
 const elseIfCtx = elseIfClauses[index];
 let elseIfSignature: string = SCR.ELSE_IF;
 if (signatures.has(SCR.ELSE_IF)) {
 const children = ifNode.children;
 let elseIfIndex = 0;
 for (const key of children.keys()) {
 if (key.startsWith(SCR.ELSE_IF + ":")) elseIfIndex++;
 }
 elseIfSignature = SCR.ELSE_IF + ":" + elseIfIndex;
 } else if (index > 0) {
 const children = ifNode.children;
 if (children.has(SCR.ELSE_IF)) {
 const existingElseIfNode = children.get(SCR.ELSE_IF)!;
 const existingElseIfSignature = SCR.ELSE_IF + ":0";
 existingElseIfNode.signature = existingElseIfSignature;
 children.delete(SCR.ELSE_IF);
 children.set(existingElseIfSignature, existingElseIfNode);
 signatures.add(SCR.ELSE_IF);
 elseIfSignature = SCR.ELSE_IF + ":" + index;
 }
 }
 const elseIfNode = new ScrContainerNode(elseIfSignature, this.startIdx(elseIfCtx), this.stopIdx(elseIfCtx), this.line(elseIfCtx), this.ts);
 this.currentContainerNode = elseIfNode;
 this.visitFunctionBlockContent(elseIfNode, elseIfCtx.functionBlock());
 ifNode.addChild(elseIfNode);
 }
 this.repeatableFunctions.set(this.currentFunBlockSignature, signatures);
 const elseCtx = ctx.elseClause();
 if (elseCtx !== null) {
 const elseNode = new ScrContainerNode(SCR.ELSE, this.startIdx(elseCtx), this.stopIdx(elseCtx), this.line(elseCtx), this.ts);
 this.currentContainerNode = elseNode;
 this.visitFunctionBlockContent(elseNode, elseCtx.functionBlock());
 ifNode.addChild(elseNode);
 }
 this.currentContainerNode = previousContainer;
 return ifNode;
 };

 private generateFunctionBlockSignature(baseSignature: string): string {
 let signature = baseSignature;
 const repeatable = this.repeatableFunctions.get(this.currentFunBlockSignature) ?? new Set<string>();
 const children = this.currentContainerNode!.children;
 if (repeatable.has(signature)) {
 let index = 0;
 for (const key of children.keys()) {
 if (key.startsWith(signature + ":") && allDigits(key.substring((signature + ":").length))) index++;
 }
 signature = signature + ":" + index;
 } else if (children.has(signature)) {
 const lastNode = children.get(signature)!;
 repeatable.add(signature);
 const lastNewSignature = signature + ":0";
 lastNode.signature = lastNewSignature;
 children.delete(signature);
 children.set(lastNewSignature, lastNode);
 signature = signature + ":1";
 }
 this.repeatableFunctions.set(this.currentFunBlockSignature, repeatable);
 return signature;
 }

 private generateFunctionBlockArgsSignature(signaturePrefix: string, argsList: string[]): string {
 if (argsList.length === 0) {
 return this.generateIndexedSignature(signaturePrefix);
 }
 const signatureWithParam = signaturePrefix + ":" + argsList[0];
 const children = this.currentContainerNode!.children;
 if (children.has(signatureWithParam) || this.hasIndexedChildren(signatureWithParam)) {
 return this.generateIndexedSignature(signatureWithParam);
 }
 return signatureWithParam;
 }

 private generateIndexedSignature(signaturePrefix: string): string {
 const children = this.currentContainerNode!.children;
 let index = 0;
 while (children.has(signaturePrefix + ":" + index)) index++;
 return signaturePrefix + ":" + index;
 }

 private hasIndexedChildren(signaturePrefix: string): boolean {
 return this.currentContainerNode!.children.has(signaturePrefix + ":0");
 }

 private generateFunctionCallSignature(signaturePrefix: string, argsList: string[]): string {
 if (argsList.length <= 1) {
 const children = this.currentContainerNode!.children;
 let index = 0;
 for (const key of children.keys()) {
 if (key.startsWith(signaturePrefix + ":") && allDigits(key.substring((signaturePrefix + ":").length))) index++;
 }
 return signaturePrefix + ":" + index;
 }
 const signatureWithParam = signaturePrefix + ":" + argsList[0];
 const children = this.currentContainerNode!.children;
 if (children.has(signatureWithParam)) {
 let index = 0;
 for (const key of children.keys()) {
 if (key.startsWith(signatureWithParam + ":") && allDigits(key.substring((signatureWithParam + ":").length))) index++;
 }
 return signatureWithParam + ":" + index;
 }
 return signatureWithParam;
 }

 private visitFunctionBlockContent(parent: ScrContainerNode, ctx: FunctionBlockContext | null): void {
 if (!ctx) return;
 const statements = ctx.statements();
 if (!statements) return;
 for (const statement of statements) {
 const child = this.visit(statement);
 if (child) parent.addChild(child);
 }
 }

 private getFullText(ctx: ParserRuleContext): string {
 const a = ctx.start;
 const b = ctx.stop;
 if (!a || !b) return "";
 const cs = a.inputStream;
 if (!cs) return "";
 return cs.getTextFromRange(a.start, b.stop).replace(/\s/g, "");
 }

 private getValueListTexts(ctx: ValueListContext | null): string[] {
 if (!ctx) return [];
 return ctx.expression().map((e) => e.getText());
 }
}
