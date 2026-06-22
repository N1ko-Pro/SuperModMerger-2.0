
import { AbstractParseTreeVisitor } from "antlr4ng";


import { JsonContext } from "./JSONParser.js";
import { ObjContext } from "./JSONParser.js";
import { PairContext } from "./JSONParser.js";
import { ArrContext } from "./JSONParser.js";
import { ValueContext } from "./JSONParser.js";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `JSONParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export class JSONVisitor<Result> extends AbstractParseTreeVisitor<Result> {
    /**
     * Visit a parse tree produced by `JSONParser.json`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitJson?: (ctx: JsonContext) => Result;
    /**
     * Visit a parse tree produced by `JSONParser.obj`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitObj?: (ctx: ObjContext) => Result;
    /**
     * Visit a parse tree produced by `JSONParser.pair`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitPair?: (ctx: PairContext) => Result;
    /**
     * Visit a parse tree produced by `JSONParser.arr`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitArr?: (ctx: ArrContext) => Result;
    /**
     * Visit a parse tree produced by `JSONParser.value`.
     * @param ctx the parse tree
     * @return the visitor result
     */
    visitValue?: (ctx: ValueContext) => Result;
}

