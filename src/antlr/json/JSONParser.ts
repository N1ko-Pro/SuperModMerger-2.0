
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { JSONVisitor } from "./JSONVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class JSONParser extends antlr.Parser {
    public static readonly T__0 = 1;
    public static readonly T__1 = 2;
    public static readonly T__2 = 3;
    public static readonly T__3 = 4;
    public static readonly T__4 = 5;
    public static readonly T__5 = 6;
    public static readonly T__6 = 7;
    public static readonly T__7 = 8;
    public static readonly T__8 = 9;
    public static readonly STRING = 10;
    public static readonly NUMBER = 11;
    public static readonly WS = 12;
    public static readonly RULE_json = 0;
    public static readonly RULE_obj = 1;
    public static readonly RULE_pair = 2;
    public static readonly RULE_arr = 3;
    public static readonly RULE_value = 4;

    public static readonly literalNames = [
        null, "'{'", "','", "'}'", "':'", "'['", "']'", "'true'", "'false'", 
        "'null'"
    ];

    public static readonly symbolicNames = [
        null, null, null, null, null, null, null, null, null, null, "STRING", 
        "NUMBER", "WS"
    ];
    public static readonly ruleNames = [
        "json", "obj", "pair", "arr", "value",
    ];

    public get grammarFileName(): string { return "JSON.g4"; }
    public get literalNames(): (string | null)[] { return JSONParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return JSONParser.symbolicNames; }
    public get ruleNames(): string[] { return JSONParser.ruleNames; }
    public get serializedATN(): number[] { return JSONParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, JSONParser._ATN, JSONParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public json(): JsonContext {
        let localContext = new JsonContext(this.context, this.state);
        this.enterRule(localContext, 0, JSONParser.RULE_json);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 10;
            this.value();
            this.state = 11;
            this.match(JSONParser.EOF);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public obj(): ObjContext {
        let localContext = new ObjContext(this.context, this.state);
        this.enterRule(localContext, 2, JSONParser.RULE_obj);
        let _la: number;
        try {
            this.state = 26;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 13;
                this.match(JSONParser.T__0);
                this.state = 14;
                this.pair();
                this.state = 19;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 2) {
                    {
                    {
                    this.state = 15;
                    this.match(JSONParser.T__1);
                    this.state = 16;
                    this.pair();
                    }
                    }
                    this.state = 21;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 22;
                this.match(JSONParser.T__2);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 24;
                this.match(JSONParser.T__0);
                this.state = 25;
                this.match(JSONParser.T__2);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public pair(): PairContext {
        let localContext = new PairContext(this.context, this.state);
        this.enterRule(localContext, 4, JSONParser.RULE_pair);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 28;
            this.match(JSONParser.STRING);
            this.state = 29;
            this.match(JSONParser.T__3);
            this.state = 30;
            this.value();
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public arr(): ArrContext {
        let localContext = new ArrContext(this.context, this.state);
        this.enterRule(localContext, 6, JSONParser.RULE_arr);
        let _la: number;
        try {
            this.state = 45;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 3, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 32;
                this.match(JSONParser.T__4);
                this.state = 33;
                this.value();
                this.state = 38;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 2) {
                    {
                    {
                    this.state = 34;
                    this.match(JSONParser.T__1);
                    this.state = 35;
                    this.value();
                    }
                    }
                    this.state = 40;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 41;
                this.match(JSONParser.T__5);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 43;
                this.match(JSONParser.T__4);
                this.state = 44;
                this.match(JSONParser.T__5);
                }
                break;
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }
    public value(): ValueContext {
        let localContext = new ValueContext(this.context, this.state);
        this.enterRule(localContext, 8, JSONParser.RULE_value);
        try {
            this.state = 54;
            this.errorHandler.sync(this);
            switch (this.tokenStream.LA(1)) {
            case JSONParser.STRING:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 47;
                this.match(JSONParser.STRING);
                }
                break;
            case JSONParser.NUMBER:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 48;
                this.match(JSONParser.NUMBER);
                }
                break;
            case JSONParser.T__0:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 49;
                this.obj();
                }
                break;
            case JSONParser.T__4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 50;
                this.arr();
                }
                break;
            case JSONParser.T__6:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 51;
                this.match(JSONParser.T__6);
                }
                break;
            case JSONParser.T__7:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 52;
                this.match(JSONParser.T__7);
                }
                break;
            case JSONParser.T__8:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 53;
                this.match(JSONParser.T__8);
                }
                break;
            default:
                throw new antlr.NoViableAltException(this);
            }
        }
        catch (re) {
            if (re instanceof antlr.RecognitionException) {
                this.errorHandler.reportError(this, re);
                this.errorHandler.recover(this, re);
            } else {
                throw re;
            }
        }
        finally {
            this.exitRule();
        }
        return localContext;
    }

    public static readonly _serializedATN: number[] = [
        4,1,12,57,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,1,0,1,0,1,0,1,
        1,1,1,1,1,1,1,5,1,18,8,1,10,1,12,1,21,9,1,1,1,1,1,1,1,1,1,3,1,27,
        8,1,1,2,1,2,1,2,1,2,1,3,1,3,1,3,1,3,5,3,37,8,3,10,3,12,3,40,9,3,
        1,3,1,3,1,3,1,3,3,3,46,8,3,1,4,1,4,1,4,1,4,1,4,1,4,1,4,3,4,55,8,
        4,1,4,0,0,5,0,2,4,6,8,0,0,61,0,10,1,0,0,0,2,26,1,0,0,0,4,28,1,0,
        0,0,6,45,1,0,0,0,8,54,1,0,0,0,10,11,3,8,4,0,11,12,5,0,0,1,12,1,1,
        0,0,0,13,14,5,1,0,0,14,19,3,4,2,0,15,16,5,2,0,0,16,18,3,4,2,0,17,
        15,1,0,0,0,18,21,1,0,0,0,19,17,1,0,0,0,19,20,1,0,0,0,20,22,1,0,0,
        0,21,19,1,0,0,0,22,23,5,3,0,0,23,27,1,0,0,0,24,25,5,1,0,0,25,27,
        5,3,0,0,26,13,1,0,0,0,26,24,1,0,0,0,27,3,1,0,0,0,28,29,5,10,0,0,
        29,30,5,4,0,0,30,31,3,8,4,0,31,5,1,0,0,0,32,33,5,5,0,0,33,38,3,8,
        4,0,34,35,5,2,0,0,35,37,3,8,4,0,36,34,1,0,0,0,37,40,1,0,0,0,38,36,
        1,0,0,0,38,39,1,0,0,0,39,41,1,0,0,0,40,38,1,0,0,0,41,42,5,6,0,0,
        42,46,1,0,0,0,43,44,5,5,0,0,44,46,5,6,0,0,45,32,1,0,0,0,45,43,1,
        0,0,0,46,7,1,0,0,0,47,55,5,10,0,0,48,55,5,11,0,0,49,55,3,2,1,0,50,
        55,3,6,3,0,51,55,5,7,0,0,52,55,5,8,0,0,53,55,5,9,0,0,54,47,1,0,0,
        0,54,48,1,0,0,0,54,49,1,0,0,0,54,50,1,0,0,0,54,51,1,0,0,0,54,52,
        1,0,0,0,54,53,1,0,0,0,55,9,1,0,0,0,5,19,26,38,45,54
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!JSONParser.__ATN) {
            JSONParser.__ATN = new antlr.ATNDeserializer().deserialize(JSONParser._serializedATN);
        }

        return JSONParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(JSONParser.literalNames, JSONParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return JSONParser.vocabulary;
    }

    private static readonly decisionsToDFA = JSONParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class JsonContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public value(): ValueContext {
        return this.getRuleContext(0, ValueContext)!;
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(JSONParser.EOF, 0)!;
    }
    public override get ruleIndex(): number {
        return JSONParser.RULE_json;
    }
    public override accept<Result>(visitor: JSONVisitor<Result>): Result | null {
        if (visitor.visitJson) {
            return visitor.visitJson(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ObjContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public pair(): PairContext[];
    public pair(i: number): PairContext | null;
    public pair(i?: number): PairContext[] | PairContext | null {
        if (i === undefined) {
            return this.getRuleContexts(PairContext);
        }

        return this.getRuleContext(i, PairContext);
    }
    public override get ruleIndex(): number {
        return JSONParser.RULE_obj;
    }
    public override accept<Result>(visitor: JSONVisitor<Result>): Result | null {
        if (visitor.visitObj) {
            return visitor.visitObj(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PairContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(JSONParser.STRING, 0)!;
    }
    public value(): ValueContext {
        return this.getRuleContext(0, ValueContext)!;
    }
    public override get ruleIndex(): number {
        return JSONParser.RULE_pair;
    }
    public override accept<Result>(visitor: JSONVisitor<Result>): Result | null {
        if (visitor.visitPair) {
            return visitor.visitPair(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArrContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public value(): ValueContext[];
    public value(i: number): ValueContext | null;
    public value(i?: number): ValueContext[] | ValueContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ValueContext);
        }

        return this.getRuleContext(i, ValueContext);
    }
    public override get ruleIndex(): number {
        return JSONParser.RULE_arr;
    }
    public override accept<Result>(visitor: JSONVisitor<Result>): Result | null {
        if (visitor.visitArr) {
            return visitor.visitArr(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public STRING(): antlr.TerminalNode | null {
        return this.getToken(JSONParser.STRING, 0);
    }
    public NUMBER(): antlr.TerminalNode | null {
        return this.getToken(JSONParser.NUMBER, 0);
    }
    public obj(): ObjContext | null {
        return this.getRuleContext(0, ObjContext);
    }
    public arr(): ArrContext | null {
        return this.getRuleContext(0, ArrContext);
    }
    public override get ruleIndex(): number {
        return JSONParser.RULE_value;
    }
    public override accept<Result>(visitor: JSONVisitor<Result>): Result | null {
        if (visitor.visitValue) {
            return visitor.visitValue(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
