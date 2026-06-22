
import { AbstractParseTreeVisitor } from "antlr4ng";


import { FileContext } from "./TechlandScriptParser.js";
import { DefinitionContext } from "./TechlandScriptParser.js";
import { ImportDeclContext } from "./TechlandScriptParser.js";
import { ExportDeclContext } from "./TechlandScriptParser.js";
import { ExternDeclContext } from "./TechlandScriptParser.js";
import { DirectiveCallContext } from "./TechlandScriptParser.js";
import { MacroDeclContext } from "./TechlandScriptParser.js";
import { SubDeclContext } from "./TechlandScriptParser.js";
import { LogicControlDeclContext } from "./TechlandScriptParser.js";
import { ElseIfClauseContext } from "./TechlandScriptParser.js";
import { ElseClauseContext } from "./TechlandScriptParser.js";
import { ParamListContext } from "./TechlandScriptParser.js";
import { ParamContext } from "./TechlandScriptParser.js";
import { FunctionBlockContext } from "./TechlandScriptParser.js";
import { StatementsContext } from "./TechlandScriptParser.js";
import { VariableDeclContext } from "./TechlandScriptParser.js";
import { VariableAssignDeclContext } from "./TechlandScriptParser.js";
import { FunctionCallDeclContext } from "./TechlandScriptParser.js";
import { MethodReferenceFunCallDeclContext } from "./TechlandScriptParser.js";
import { FunctionBlockDeclContext } from "./TechlandScriptParser.js";
import { UseDeclContext } from "./TechlandScriptParser.js";
import { UseSemanticDeclContext } from "./TechlandScriptParser.js";
import { ValueListContext } from "./TechlandScriptParser.js";
import { TypeContext } from "./TechlandScriptParser.js";
import { ExpressionContext } from "./TechlandScriptParser.js";
import { FieldAccessContext } from "./TechlandScriptParser.js";
import { ArrayValueContext } from "./TechlandScriptParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `TechlandScriptParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class TechlandScriptVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `TechlandScriptParser.file`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFile?: (ctx: FileContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.definition`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDefinition?: (ctx: DefinitionContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.importDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitImportDecl?: (ctx: ImportDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.exportDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExportDecl?: (ctx: ExportDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.externDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExternDecl?: (ctx: ExternDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.directiveCall`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDirectiveCall?: (ctx: DirectiveCallContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.macroDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMacroDecl?: (ctx: MacroDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.subDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitSubDecl?: (ctx: SubDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.logicControlDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitLogicControlDecl?: (ctx: LogicControlDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.elseIfClause`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElseIfClause?: (ctx: ElseIfClauseContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.elseClause`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElseClause?: (ctx: ElseClauseContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.paramList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParamList?: (ctx: ParamListContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.param`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitParam?: (ctx: ParamContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.functionBlock`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionBlock?: (ctx: FunctionBlockContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.statements`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitStatements?: (ctx: StatementsContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.variableDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableDecl?: (ctx: VariableDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.variableAssignDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitVariableAssignDecl?: (ctx: VariableAssignDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.functionCallDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionCallDecl?: (ctx: FunctionCallDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.methodReferenceFunCallDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMethodReferenceFunCallDecl?: (ctx: MethodReferenceFunCallDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.functionBlockDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFunctionBlockDecl?: (ctx: FunctionBlockDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.useDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUseDecl?: (ctx: UseDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.useSemanticDecl`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitUseSemanticDecl?: (ctx: UseSemanticDeclContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.valueList`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitValueList?: (ctx: ValueListContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.type`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitType?: (ctx: TypeContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.expression`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitExpression?: (ctx: ExpressionContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.fieldAccess`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitFieldAccess?: (ctx: FieldAccessContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandScriptParser.arrayValue`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArrayValue?: (ctx: ArrayValueContext) => Result;
}

