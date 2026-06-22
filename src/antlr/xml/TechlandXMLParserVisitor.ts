
import { AbstractParseTreeVisitor } from "antlr4ng";


import { DocumentContext } from "./TechlandXMLParser.js";
import { PrologContext } from "./TechlandXMLParser.js";
import { ContentContext } from "./TechlandXMLParser.js";
import { ElementContext } from "./TechlandXMLParser.js";
import { ReferenceContext } from "./TechlandXMLParser.js";
import { AttributeContext } from "./TechlandXMLParser.js";
import { ChardataContext } from "./TechlandXMLParser.js";
import { MiscContext } from "./TechlandXMLParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `TechlandXMLParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class TechlandXMLParserVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `TechlandXMLParser.document`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitDocument?: (ctx: DocumentContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.prolog`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitProlog?: (ctx: PrologContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.content`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitContent?: (ctx: ContentContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.element`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitElement?: (ctx: ElementContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.reference`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitReference?: (ctx: ReferenceContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.attribute`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitAttribute?: (ctx: AttributeContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.chardata`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitChardata?: (ctx: ChardataContext) => Result;
    /**
     * Visit a parse tree produced by `TechlandXMLParser.misc`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitMisc?: (ctx: MiscContext) => Result;
}

