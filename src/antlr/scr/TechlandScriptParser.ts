
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { TechlandScriptVisitor } from "./TechlandScriptVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class TechlandScriptParser extends antlr.Parser {
    public static readonly Import = 1;
    public static readonly Extern = 2;
    public static readonly Export = 3;
    public static readonly Sub = 4;
    public static readonly Use = 5;
    public static readonly UseSemantic = 6;
    public static readonly Exclamation = 7;
    public static readonly KwIf = 8;
    public static readonly KwElse = 9;
    public static readonly LParen = 10;
    public static readonly RParen = 11;
    public static readonly LBrace = 12;
    public static readonly RBrace = 13;
    public static readonly Semicolon = 14;
    public static readonly Comma = 15;
    public static readonly Equals = 16;
    public static readonly LBracket = 17;
    public static readonly RBracket = 18;
    public static readonly Dot = 19;
    public static readonly DoubleColon = 20;
    public static readonly Plus = 21;
    public static readonly Minus = 22;
    public static readonly Mul = 23;
    public static readonly Div = 24;
    public static readonly LogicAnd = 25;
    public static readonly LogicOr = 26;
    public static readonly BitOr = 27;
    public static readonly BitAnd = 28;
    public static readonly BitNot = 29;
    public static readonly Question = 30;
    public static readonly Colon = 31;
    public static readonly Gt = 32;
    public static readonly Lt = 33;
    public static readonly Eq = 34;
    public static readonly NotEq = 35;
    public static readonly Gte = 36;
    public static readonly Lte = 37;
    public static readonly Bool = 38;
    public static readonly Id = 39;
    public static readonly MacroId = 40;
    public static readonly Number = 41;
    public static readonly String = 42;
    public static readonly LineComment = 43;
    public static readonly BlockComment = 44;
    public static readonly WhiteSpaces = 45;
    public static readonly RULE_file = 0;
    public static readonly RULE_definition = 1;
    public static readonly RULE_importDecl = 2;
    public static readonly RULE_exportDecl = 3;
    public static readonly RULE_externDecl = 4;
    public static readonly RULE_directiveCall = 5;
    public static readonly RULE_macroDecl = 6;
    public static readonly RULE_subDecl = 7;
    public static readonly RULE_logicControlDecl = 8;
    public static readonly RULE_elseIfClause = 9;
    public static readonly RULE_elseClause = 10;
    public static readonly RULE_paramList = 11;
    public static readonly RULE_param = 12;
    public static readonly RULE_functionBlock = 13;
    public static readonly RULE_statements = 14;
    public static readonly RULE_variableDecl = 15;
    public static readonly RULE_variableAssignDecl = 16;
    public static readonly RULE_functionCallDecl = 17;
    public static readonly RULE_methodReferenceFunCallDecl = 18;
    public static readonly RULE_functionBlockDecl = 19;
    public static readonly RULE_useDecl = 20;
    public static readonly RULE_useSemanticDecl = 21;
    public static readonly RULE_valueList = 22;
    public static readonly RULE_type = 23;
    public static readonly RULE_expression = 24;
    public static readonly RULE_fieldAccess = 25;
    public static readonly RULE_arrayValue = 26;

    public static readonly literalNames = [
        null, "'import'", "'extern'", "'export'", "'sub'", "'use'", "'use_semantic'", 
        "'!'", null, null, "'('", "')'", "'{'", "'}'", "';'", "','", "'='", 
        "'['", "']'", "'.'", "'::'", "'+'", "'-'", "'*'", "'/'", "'&&'", 
        "'||'", "'|'", "'&'", "'~'", "'?'", "':'", "'>'", "'<'", "'=='", 
        "'!='", "'>='", "'<='"
    ];

    public static readonly symbolicNames = [
        null, "Import", "Extern", "Export", "Sub", "Use", "UseSemantic", 
        "Exclamation", "KwIf", "KwElse", "LParen", "RParen", "LBrace", "RBrace", 
        "Semicolon", "Comma", "Equals", "LBracket", "RBracket", "Dot", "DoubleColon", 
        "Plus", "Minus", "Mul", "Div", "LogicAnd", "LogicOr", "BitOr", "BitAnd", 
        "BitNot", "Question", "Colon", "Gt", "Lt", "Eq", "NotEq", "Gte", 
        "Lte", "Bool", "Id", "MacroId", "Number", "String", "LineComment", 
        "BlockComment", "WhiteSpaces"
    ];
    public static readonly ruleNames = [
        "file", "definition", "importDecl", "exportDecl", "externDecl", 
        "directiveCall", "macroDecl", "subDecl", "logicControlDecl", "elseIfClause", 
        "elseClause", "paramList", "param", "functionBlock", "statements", 
        "variableDecl", "variableAssignDecl", "functionCallDecl", "methodReferenceFunCallDecl", 
        "functionBlockDecl", "useDecl", "useSemanticDecl", "valueList", 
        "type", "expression", "fieldAccess", "arrayValue",
    ];

    public get grammarFileName(): string { return "TechlandScript.g4"; }
    public get literalNames(): (string | null)[] { return TechlandScriptParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return TechlandScriptParser.symbolicNames; }
    public get ruleNames(): string[] { return TechlandScriptParser.ruleNames; }
    public get serializedATN(): number[] { return TechlandScriptParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, TechlandScriptParser._ATN, TechlandScriptParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public file(): FileContext {
        let localContext = new FileContext(this.context, this.state);
        this.enterRule(localContext, 0, TechlandScriptParser.RULE_file);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 57;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 222) !== 0) || _la === 39 || _la === 40) {
                {
                {
                this.state = 54;
                this.definition();
                }
                }
                this.state = 59;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 60;
            this.match(TechlandScriptParser.EOF);
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
    public definition(): DefinitionContext {
        let localContext = new DefinitionContext(this.context, this.state);
        this.enterRule(localContext, 2, TechlandScriptParser.RULE_definition);
        try {
            this.state = 73;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 1, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 62;
                this.importDecl();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 63;
                this.exportDecl();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 64;
                this.externDecl();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 65;
                this.directiveCall();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 66;
                this.useSemanticDecl();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 67;
                this.macroDecl();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 68;
                this.subDecl();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 69;
                this.variableDecl();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 70;
                this.functionBlockDecl();
                }
                break;
            case 10:
                this.enterOuterAlt(localContext, 10);
                {
                this.state = 71;
                this.methodReferenceFunCallDecl();
                }
                break;
            case 11:
                this.enterOuterAlt(localContext, 11);
                {
                this.state = 72;
                this.functionCallDecl();
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
    public importDecl(): ImportDeclContext {
        let localContext = new ImportDeclContext(this.context, this.state);
        this.enterRule(localContext, 4, TechlandScriptParser.RULE_importDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 75;
            this.match(TechlandScriptParser.Import);
            this.state = 76;
            this.match(TechlandScriptParser.String);
            this.state = 78;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 77;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public exportDecl(): ExportDeclContext {
        let localContext = new ExportDeclContext(this.context, this.state);
        this.enterRule(localContext, 6, TechlandScriptParser.RULE_exportDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 80;
            this.match(TechlandScriptParser.Export);
            this.state = 81;
            this.type_();
            this.state = 82;
            this.match(TechlandScriptParser.Id);
            this.state = 83;
            this.match(TechlandScriptParser.Equals);
            this.state = 84;
            this.expression(0);
            this.state = 86;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 85;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public externDecl(): ExternDeclContext {
        let localContext = new ExternDeclContext(this.context, this.state);
        this.enterRule(localContext, 8, TechlandScriptParser.RULE_externDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 88;
            this.match(TechlandScriptParser.Extern);
            this.state = 89;
            this.type_();
            this.state = 90;
            this.match(TechlandScriptParser.Id);
            this.state = 92;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 91;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public directiveCall(): DirectiveCallContext {
        let localContext = new DirectiveCallContext(this.context, this.state);
        this.enterRule(localContext, 10, TechlandScriptParser.RULE_directiveCall);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 94;
            this.match(TechlandScriptParser.Exclamation);
            this.state = 95;
            this.match(TechlandScriptParser.Id);
            this.state = 96;
            this.match(TechlandScriptParser.LParen);
            this.state = 98;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                {
                this.state = 97;
                this.valueList();
                }
            }

            this.state = 100;
            this.match(TechlandScriptParser.RParen);
            this.state = 102;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 101;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public macroDecl(): MacroDeclContext {
        let localContext = new MacroDeclContext(this.context, this.state);
        this.enterRule(localContext, 12, TechlandScriptParser.RULE_macroDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 104;
            this.match(TechlandScriptParser.MacroId);
            this.state = 105;
            this.match(TechlandScriptParser.LParen);
            this.state = 106;
            this.valueList();
            this.state = 107;
            this.match(TechlandScriptParser.RParen);
            this.state = 109;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 108;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public subDecl(): SubDeclContext {
        let localContext = new SubDeclContext(this.context, this.state);
        this.enterRule(localContext, 14, TechlandScriptParser.RULE_subDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 111;
            this.match(TechlandScriptParser.Sub);
            this.state = 112;
            this.match(TechlandScriptParser.Id);
            this.state = 113;
            this.match(TechlandScriptParser.LParen);
            this.state = 115;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 39) {
                {
                this.state = 114;
                this.paramList();
                }
            }

            this.state = 117;
            this.match(TechlandScriptParser.RParen);
            this.state = 118;
            this.functionBlock();
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
    public logicControlDecl(): LogicControlDeclContext {
        let localContext = new LogicControlDeclContext(this.context, this.state);
        this.enterRule(localContext, 16, TechlandScriptParser.RULE_logicControlDecl);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 120;
            this.match(TechlandScriptParser.KwIf);
            this.state = 121;
            this.match(TechlandScriptParser.LParen);
            this.state = 122;
            this.expression(0);
            this.state = 127;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 15) {
                {
                {
                this.state = 123;
                this.match(TechlandScriptParser.Comma);
                this.state = 124;
                this.expression(0);
                }
                }
                this.state = 129;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 130;
            this.match(TechlandScriptParser.RParen);
            this.state = 131;
            this.functionBlock();
            this.state = 135;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 10, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 132;
                    this.elseIfClause();
                    }
                    }
                }
                this.state = 137;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 10, this.context);
            }
            this.state = 139;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 9) {
                {
                this.state = 138;
                this.elseClause();
                }
            }

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
    public elseIfClause(): ElseIfClauseContext {
        let localContext = new ElseIfClauseContext(this.context, this.state);
        this.enterRule(localContext, 18, TechlandScriptParser.RULE_elseIfClause);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 141;
            this.match(TechlandScriptParser.KwElse);
            this.state = 142;
            this.match(TechlandScriptParser.KwIf);
            this.state = 143;
            this.match(TechlandScriptParser.LParen);
            this.state = 144;
            this.expression(0);
            this.state = 145;
            this.match(TechlandScriptParser.RParen);
            this.state = 146;
            this.functionBlock();
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
    public elseClause(): ElseClauseContext {
        let localContext = new ElseClauseContext(this.context, this.state);
        this.enterRule(localContext, 20, TechlandScriptParser.RULE_elseClause);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 148;
            this.match(TechlandScriptParser.KwElse);
            this.state = 154;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 10) {
                {
                this.state = 149;
                this.match(TechlandScriptParser.LParen);
                this.state = 151;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                    {
                    this.state = 150;
                    this.expression(0);
                    }
                }

                this.state = 153;
                this.match(TechlandScriptParser.RParen);
                }
            }

            this.state = 156;
            this.functionBlock();
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
    public paramList(): ParamListContext {
        let localContext = new ParamListContext(this.context, this.state);
        this.enterRule(localContext, 22, TechlandScriptParser.RULE_paramList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 158;
            this.param();
            this.state = 163;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 15) {
                {
                {
                this.state = 159;
                this.match(TechlandScriptParser.Comma);
                this.state = 160;
                this.param();
                }
                }
                this.state = 165;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
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
    public param(): ParamContext {
        let localContext = new ParamContext(this.context, this.state);
        this.enterRule(localContext, 24, TechlandScriptParser.RULE_param);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 166;
            this.type_();
            this.state = 167;
            this.match(TechlandScriptParser.Id);
            this.state = 170;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 16) {
                {
                this.state = 168;
                this.match(TechlandScriptParser.Equals);
                this.state = 169;
                this.expression(0);
                }
            }

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
    public functionBlock(): FunctionBlockContext {
        let localContext = new FunctionBlockContext(this.context, this.state);
        this.enterRule(localContext, 26, TechlandScriptParser.RULE_functionBlock);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 172;
            this.match(TechlandScriptParser.LBrace);
            this.state = 176;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 292) !== 0) || _la === 39 || _la === 40) {
                {
                {
                this.state = 173;
                this.statements();
                }
                }
                this.state = 178;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 179;
            this.match(TechlandScriptParser.RBrace);
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
    public statements(): StatementsContext {
        let localContext = new StatementsContext(this.context, this.state);
        this.enterRule(localContext, 28, TechlandScriptParser.RULE_statements);
        try {
            this.state = 190;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 17, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 181;
                this.logicControlDecl();
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 182;
                this.useDecl();
                }
                break;
            case 3:
                this.enterOuterAlt(localContext, 3);
                {
                this.state = 183;
                this.functionBlockDecl();
                }
                break;
            case 4:
                this.enterOuterAlt(localContext, 4);
                {
                this.state = 184;
                this.methodReferenceFunCallDecl();
                }
                break;
            case 5:
                this.enterOuterAlt(localContext, 5);
                {
                this.state = 185;
                this.variableDecl();
                }
                break;
            case 6:
                this.enterOuterAlt(localContext, 6);
                {
                this.state = 186;
                this.variableAssignDecl();
                }
                break;
            case 7:
                this.enterOuterAlt(localContext, 7);
                {
                this.state = 187;
                this.externDecl();
                }
                break;
            case 8:
                this.enterOuterAlt(localContext, 8);
                {
                this.state = 188;
                this.macroDecl();
                }
                break;
            case 9:
                this.enterOuterAlt(localContext, 9);
                {
                this.state = 189;
                this.functionCallDecl();
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
    public variableDecl(): VariableDeclContext {
        let localContext = new VariableDeclContext(this.context, this.state);
        this.enterRule(localContext, 30, TechlandScriptParser.RULE_variableDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 192;
            this.type_();
            this.state = 193;
            this.match(TechlandScriptParser.Id);
            this.state = 196;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 16) {
                {
                this.state = 194;
                this.match(TechlandScriptParser.Equals);
                this.state = 195;
                this.expression(0);
                }
            }

            this.state = 199;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 198;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public variableAssignDecl(): VariableAssignDeclContext {
        let localContext = new VariableAssignDeclContext(this.context, this.state);
        this.enterRule(localContext, 32, TechlandScriptParser.RULE_variableAssignDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 201;
            this.match(TechlandScriptParser.Id);
            this.state = 202;
            this.match(TechlandScriptParser.Equals);
            this.state = 203;
            this.expression(0);
            this.state = 205;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 204;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public functionCallDecl(): FunctionCallDeclContext {
        let localContext = new FunctionCallDeclContext(this.context, this.state);
        this.enterRule(localContext, 34, TechlandScriptParser.RULE_functionCallDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 207;
            this.match(TechlandScriptParser.Id);
            this.state = 208;
            this.match(TechlandScriptParser.LParen);
            this.state = 210;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                {
                this.state = 209;
                this.valueList();
                }
            }

            this.state = 212;
            this.match(TechlandScriptParser.RParen);
            this.state = 214;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 213;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public methodReferenceFunCallDecl(): MethodReferenceFunCallDeclContext {
        let localContext = new MethodReferenceFunCallDeclContext(this.context, this.state);
        this.enterRule(localContext, 36, TechlandScriptParser.RULE_methodReferenceFunCallDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 216;
            this.match(TechlandScriptParser.Id);
            this.state = 217;
            this.match(TechlandScriptParser.DoubleColon);
            this.state = 218;
            this.match(TechlandScriptParser.Id);
            this.state = 219;
            this.match(TechlandScriptParser.LParen);
            this.state = 221;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                {
                this.state = 220;
                this.valueList();
                }
            }

            this.state = 223;
            this.match(TechlandScriptParser.RParen);
            this.state = 225;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 224;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public functionBlockDecl(): FunctionBlockDeclContext {
        let localContext = new FunctionBlockDeclContext(this.context, this.state);
        this.enterRule(localContext, 38, TechlandScriptParser.RULE_functionBlockDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 227;
            this.match(TechlandScriptParser.Id);
            this.state = 228;
            this.match(TechlandScriptParser.LParen);
            this.state = 230;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                {
                this.state = 229;
                this.valueList();
                }
            }

            this.state = 232;
            this.match(TechlandScriptParser.RParen);
            this.state = 233;
            this.functionBlock();
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
    public useDecl(): UseDeclContext {
        let localContext = new UseDeclContext(this.context, this.state);
        this.enterRule(localContext, 40, TechlandScriptParser.RULE_useDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 235;
            this.match(TechlandScriptParser.Use);
            this.state = 236;
            this.match(TechlandScriptParser.Id);
            this.state = 237;
            this.match(TechlandScriptParser.LParen);
            this.state = 239;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                {
                this.state = 238;
                this.valueList();
                }
            }

            this.state = 241;
            this.match(TechlandScriptParser.RParen);
            this.state = 243;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 242;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public useSemanticDecl(): UseSemanticDeclContext {
        let localContext = new UseSemanticDeclContext(this.context, this.state);
        this.enterRule(localContext, 42, TechlandScriptParser.RULE_useSemanticDecl);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 245;
            this.match(TechlandScriptParser.UseSemantic);
            this.state = 246;
            this.match(TechlandScriptParser.String);
            this.state = 248;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 14) {
                {
                this.state = 247;
                this.match(TechlandScriptParser.Semicolon);
                }
            }

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
    public valueList(): ValueListContext {
        let localContext = new ValueListContext(this.context, this.state);
        this.enterRule(localContext, 44, TechlandScriptParser.RULE_valueList);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 250;
            this.expression(0);
            this.state = 255;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 15) {
                {
                {
                this.state = 251;
                this.match(TechlandScriptParser.Comma);
                this.state = 252;
                this.expression(0);
                }
                }
                this.state = 257;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
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
    public type_(): TypeContext {
        let localContext = new TypeContext(this.context, this.state);
        this.enterRule(localContext, 46, TechlandScriptParser.RULE_type);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 258;
            this.match(TechlandScriptParser.Id);
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

    public expression(): ExpressionContext;
    public expression(_p: number): ExpressionContext;
    public expression(_p?: number): ExpressionContext {
        if (_p === undefined) {
            _p = 0;
        }

        let parentContext = this.context;
        let parentState = this.state;
        let localContext = new ExpressionContext(this.context, parentState);
        let previousContext = localContext;
        let _startState = 48;
        this.enterRecursionRule(localContext, 48, TechlandScriptParser.RULE_expression, _p);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 286;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 31, this.context) ) {
            case 1:
                {
                this.state = 261;
                this.match(TechlandScriptParser.LParen);
                this.state = 262;
                this.expression(0);
                this.state = 263;
                this.match(TechlandScriptParser.RParen);
                }
                break;
            case 2:
                {
                this.state = 265;
                this.fieldAccess();
                this.state = 266;
                this.match(TechlandScriptParser.LParen);
                this.state = 268;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                    {
                    this.state = 267;
                    this.valueList();
                    }
                }

                this.state = 270;
                this.match(TechlandScriptParser.RParen);
                }
                break;
            case 3:
                {
                this.state = 272;
                this.fieldAccess();
                }
                break;
            case 4:
                {
                this.state = 273;
                this.match(TechlandScriptParser.Number);
                }
                break;
            case 5:
                {
                this.state = 274;
                this.match(TechlandScriptParser.String);
                }
                break;
            case 6:
                {
                this.state = 275;
                this.match(TechlandScriptParser.Bool);
                }
                break;
            case 7:
                {
                this.state = 276;
                this.arrayValue();
                }
                break;
            case 8:
                {
                this.state = 277;
                this.match(TechlandScriptParser.Id);
                this.state = 278;
                this.match(TechlandScriptParser.Equals);
                this.state = 279;
                this.expression(12);
                }
                break;
            case 9:
                {
                this.state = 280;
                this.match(TechlandScriptParser.BitNot);
                this.state = 281;
                this.expression(11);
                }
                break;
            case 10:
                {
                this.state = 282;
                this.match(TechlandScriptParser.Exclamation);
                this.state = 283;
                this.expression(10);
                }
                break;
            case 11:
                {
                this.state = 284;
                this.match(TechlandScriptParser.Minus);
                this.state = 285;
                this.expression(9);
                }
                break;
            }
            this.context!.stop = this.tokenStream.LT(-1);
            this.state = 317;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 33, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    if (this.parseListeners != null) {
                        this.triggerExitRuleEvent();
                    }
                    previousContext = localContext;
                    {
                    this.state = 315;
                    this.errorHandler.sync(this);
                    switch (this.interpreter.adaptivePredict(this.tokenStream, 32, this.context) ) {
                    case 1:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 288;
                        if (!(this.precpred(this.context, 8))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 8)");
                        }
                        this.state = 289;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 23 || _la === 24)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 290;
                        this.expression(9);
                        }
                        break;
                    case 2:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 291;
                        if (!(this.precpred(this.context, 7))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 7)");
                        }
                        this.state = 292;
                        _la = this.tokenStream.LA(1);
                        if(!(_la === 21 || _la === 22)) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 293;
                        this.expression(8);
                        }
                        break;
                    case 3:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 294;
                        if (!(this.precpred(this.context, 6))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 6)");
                        }
                        this.state = 295;
                        this.match(TechlandScriptParser.BitOr);
                        this.state = 296;
                        this.expression(7);
                        }
                        break;
                    case 4:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 297;
                        if (!(this.precpred(this.context, 5))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 5)");
                        }
                        this.state = 298;
                        this.match(TechlandScriptParser.BitAnd);
                        this.state = 299;
                        this.expression(6);
                        }
                        break;
                    case 5:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 300;
                        if (!(this.precpred(this.context, 4))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 4)");
                        }
                        this.state = 301;
                        _la = this.tokenStream.LA(1);
                        if(!(((((_la - 32)) & ~0x1F) === 0 && ((1 << (_la - 32)) & 63) !== 0))) {
                        this.errorHandler.recoverInline(this);
                        }
                        else {
                            this.errorHandler.reportMatch(this);
                            this.consume();
                        }
                        this.state = 302;
                        this.expression(5);
                        }
                        break;
                    case 6:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 303;
                        if (!(this.precpred(this.context, 3))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 3)");
                        }
                        this.state = 304;
                        this.match(TechlandScriptParser.LogicAnd);
                        this.state = 305;
                        this.expression(4);
                        }
                        break;
                    case 7:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 306;
                        if (!(this.precpred(this.context, 2))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 2)");
                        }
                        this.state = 307;
                        this.match(TechlandScriptParser.LogicOr);
                        this.state = 308;
                        this.expression(3);
                        }
                        break;
                    case 8:
                        {
                        localContext = new ExpressionContext(parentContext, parentState);
                        this.pushNewRecursionContext(localContext, _startState, TechlandScriptParser.RULE_expression);
                        this.state = 309;
                        if (!(this.precpred(this.context, 1))) {
                            throw this.createFailedPredicateException("this.precpred(this.context, 1)");
                        }
                        this.state = 310;
                        this.match(TechlandScriptParser.Question);
                        this.state = 311;
                        this.expression(0);
                        this.state = 312;
                        this.match(TechlandScriptParser.Colon);
                        this.state = 313;
                        this.expression(2);
                        }
                        break;
                    }
                    }
                }
                this.state = 319;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 33, this.context);
            }
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
            this.unrollRecursionContexts(parentContext);
        }
        return localContext;
    }
    public fieldAccess(): FieldAccessContext {
        let localContext = new FieldAccessContext(this.context, this.state);
        this.enterRule(localContext, 50, TechlandScriptParser.RULE_fieldAccess);
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 320;
            this.match(TechlandScriptParser.Id);
            this.state = 325;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 34, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 321;
                    this.match(TechlandScriptParser.Dot);
                    this.state = 322;
                    this.match(TechlandScriptParser.Id);
                    }
                    }
                }
                this.state = 327;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 34, this.context);
            }
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
    public arrayValue(): ArrayValueContext {
        let localContext = new ArrayValueContext(this.context, this.state);
        this.enterRule(localContext, 52, TechlandScriptParser.RULE_arrayValue);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 328;
            this.match(TechlandScriptParser.LBracket);
            this.state = 330;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if ((((_la) & ~0x1F) === 0 && ((1 << _la) & 541197440) !== 0) || ((((_la - 38)) & ~0x1F) === 0 && ((1 << (_la - 38)) & 27) !== 0)) {
                {
                this.state = 329;
                this.valueList();
                }
            }

            this.state = 332;
            this.match(TechlandScriptParser.RBracket);
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

    public override sempred(localContext: antlr.ParserRuleContext | null, ruleIndex: number, predIndex: number): boolean {
        switch (ruleIndex) {
        case 24:
            return this.expression_sempred(localContext as ExpressionContext, predIndex);
        }
        return true;
    }
    private expression_sempred(localContext: ExpressionContext | null, predIndex: number): boolean {
        switch (predIndex) {
        case 0:
            return this.precpred(this.context, 8);
        case 1:
            return this.precpred(this.context, 7);
        case 2:
            return this.precpred(this.context, 6);
        case 3:
            return this.precpred(this.context, 5);
        case 4:
            return this.precpred(this.context, 4);
        case 5:
            return this.precpred(this.context, 3);
        case 6:
            return this.precpred(this.context, 2);
        case 7:
            return this.precpred(this.context, 1);
        }
        return true;
    }

    public static readonly _serializedATN: number[] = [
        4,1,45,335,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,2,8,7,8,2,9,7,9,2,10,7,10,2,11,7,11,2,12,7,12,2,13,7,13,
        2,14,7,14,2,15,7,15,2,16,7,16,2,17,7,17,2,18,7,18,2,19,7,19,2,20,
        7,20,2,21,7,21,2,22,7,22,2,23,7,23,2,24,7,24,2,25,7,25,2,26,7,26,
        1,0,5,0,56,8,0,10,0,12,0,59,9,0,1,0,1,0,1,1,1,1,1,1,1,1,1,1,1,1,
        1,1,1,1,1,1,1,1,1,1,3,1,74,8,1,1,2,1,2,1,2,3,2,79,8,2,1,3,1,3,1,
        3,1,3,1,3,1,3,3,3,87,8,3,1,4,1,4,1,4,1,4,3,4,93,8,4,1,5,1,5,1,5,
        1,5,3,5,99,8,5,1,5,1,5,3,5,103,8,5,1,6,1,6,1,6,1,6,1,6,3,6,110,8,
        6,1,7,1,7,1,7,1,7,3,7,116,8,7,1,7,1,7,1,7,1,8,1,8,1,8,1,8,1,8,5,
        8,126,8,8,10,8,12,8,129,9,8,1,8,1,8,1,8,5,8,134,8,8,10,8,12,8,137,
        9,8,1,8,3,8,140,8,8,1,9,1,9,1,9,1,9,1,9,1,9,1,9,1,10,1,10,1,10,3,
        10,152,8,10,1,10,3,10,155,8,10,1,10,1,10,1,11,1,11,1,11,5,11,162,
        8,11,10,11,12,11,165,9,11,1,12,1,12,1,12,1,12,3,12,171,8,12,1,13,
        1,13,5,13,175,8,13,10,13,12,13,178,9,13,1,13,1,13,1,14,1,14,1,14,
        1,14,1,14,1,14,1,14,1,14,1,14,3,14,191,8,14,1,15,1,15,1,15,1,15,
        3,15,197,8,15,1,15,3,15,200,8,15,1,16,1,16,1,16,1,16,3,16,206,8,
        16,1,17,1,17,1,17,3,17,211,8,17,1,17,1,17,3,17,215,8,17,1,18,1,18,
        1,18,1,18,1,18,3,18,222,8,18,1,18,1,18,3,18,226,8,18,1,19,1,19,1,
        19,3,19,231,8,19,1,19,1,19,1,19,1,20,1,20,1,20,1,20,3,20,240,8,20,
        1,20,1,20,3,20,244,8,20,1,21,1,21,1,21,3,21,249,8,21,1,22,1,22,1,
        22,5,22,254,8,22,10,22,12,22,257,9,22,1,23,1,23,1,24,1,24,1,24,1,
        24,1,24,1,24,1,24,1,24,3,24,269,8,24,1,24,1,24,1,24,1,24,1,24,1,
        24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,3,24,287,8,
        24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,
        24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,24,1,
        24,1,24,5,24,316,8,24,10,24,12,24,319,9,24,1,25,1,25,1,25,5,25,324,
        8,25,10,25,12,25,327,9,25,1,26,1,26,3,26,331,8,26,1,26,1,26,1,26,
        0,1,48,27,0,2,4,6,8,10,12,14,16,18,20,22,24,26,28,30,32,34,36,38,
        40,42,44,46,48,50,52,0,3,1,0,23,24,1,0,21,22,1,0,32,37,374,0,57,
        1,0,0,0,2,73,1,0,0,0,4,75,1,0,0,0,6,80,1,0,0,0,8,88,1,0,0,0,10,94,
        1,0,0,0,12,104,1,0,0,0,14,111,1,0,0,0,16,120,1,0,0,0,18,141,1,0,
        0,0,20,148,1,0,0,0,22,158,1,0,0,0,24,166,1,0,0,0,26,172,1,0,0,0,
        28,190,1,0,0,0,30,192,1,0,0,0,32,201,1,0,0,0,34,207,1,0,0,0,36,216,
        1,0,0,0,38,227,1,0,0,0,40,235,1,0,0,0,42,245,1,0,0,0,44,250,1,0,
        0,0,46,258,1,0,0,0,48,286,1,0,0,0,50,320,1,0,0,0,52,328,1,0,0,0,
        54,56,3,2,1,0,55,54,1,0,0,0,56,59,1,0,0,0,57,55,1,0,0,0,57,58,1,
        0,0,0,58,60,1,0,0,0,59,57,1,0,0,0,60,61,5,0,0,1,61,1,1,0,0,0,62,
        74,3,4,2,0,63,74,3,6,3,0,64,74,3,8,4,0,65,74,3,10,5,0,66,74,3,42,
        21,0,67,74,3,12,6,0,68,74,3,14,7,0,69,74,3,30,15,0,70,74,3,38,19,
        0,71,74,3,36,18,0,72,74,3,34,17,0,73,62,1,0,0,0,73,63,1,0,0,0,73,
        64,1,0,0,0,73,65,1,0,0,0,73,66,1,0,0,0,73,67,1,0,0,0,73,68,1,0,0,
        0,73,69,1,0,0,0,73,70,1,0,0,0,73,71,1,0,0,0,73,72,1,0,0,0,74,3,1,
        0,0,0,75,76,5,1,0,0,76,78,5,42,0,0,77,79,5,14,0,0,78,77,1,0,0,0,
        78,79,1,0,0,0,79,5,1,0,0,0,80,81,5,3,0,0,81,82,3,46,23,0,82,83,5,
        39,0,0,83,84,5,16,0,0,84,86,3,48,24,0,85,87,5,14,0,0,86,85,1,0,0,
        0,86,87,1,0,0,0,87,7,1,0,0,0,88,89,5,2,0,0,89,90,3,46,23,0,90,92,
        5,39,0,0,91,93,5,14,0,0,92,91,1,0,0,0,92,93,1,0,0,0,93,9,1,0,0,0,
        94,95,5,7,0,0,95,96,5,39,0,0,96,98,5,10,0,0,97,99,3,44,22,0,98,97,
        1,0,0,0,98,99,1,0,0,0,99,100,1,0,0,0,100,102,5,11,0,0,101,103,5,
        14,0,0,102,101,1,0,0,0,102,103,1,0,0,0,103,11,1,0,0,0,104,105,5,
        40,0,0,105,106,5,10,0,0,106,107,3,44,22,0,107,109,5,11,0,0,108,110,
        5,14,0,0,109,108,1,0,0,0,109,110,1,0,0,0,110,13,1,0,0,0,111,112,
        5,4,0,0,112,113,5,39,0,0,113,115,5,10,0,0,114,116,3,22,11,0,115,
        114,1,0,0,0,115,116,1,0,0,0,116,117,1,0,0,0,117,118,5,11,0,0,118,
        119,3,26,13,0,119,15,1,0,0,0,120,121,5,8,0,0,121,122,5,10,0,0,122,
        127,3,48,24,0,123,124,5,15,0,0,124,126,3,48,24,0,125,123,1,0,0,0,
        126,129,1,0,0,0,127,125,1,0,0,0,127,128,1,0,0,0,128,130,1,0,0,0,
        129,127,1,0,0,0,130,131,5,11,0,0,131,135,3,26,13,0,132,134,3,18,
        9,0,133,132,1,0,0,0,134,137,1,0,0,0,135,133,1,0,0,0,135,136,1,0,
        0,0,136,139,1,0,0,0,137,135,1,0,0,0,138,140,3,20,10,0,139,138,1,
        0,0,0,139,140,1,0,0,0,140,17,1,0,0,0,141,142,5,9,0,0,142,143,5,8,
        0,0,143,144,5,10,0,0,144,145,3,48,24,0,145,146,5,11,0,0,146,147,
        3,26,13,0,147,19,1,0,0,0,148,154,5,9,0,0,149,151,5,10,0,0,150,152,
        3,48,24,0,151,150,1,0,0,0,151,152,1,0,0,0,152,153,1,0,0,0,153,155,
        5,11,0,0,154,149,1,0,0,0,154,155,1,0,0,0,155,156,1,0,0,0,156,157,
        3,26,13,0,157,21,1,0,0,0,158,163,3,24,12,0,159,160,5,15,0,0,160,
        162,3,24,12,0,161,159,1,0,0,0,162,165,1,0,0,0,163,161,1,0,0,0,163,
        164,1,0,0,0,164,23,1,0,0,0,165,163,1,0,0,0,166,167,3,46,23,0,167,
        170,5,39,0,0,168,169,5,16,0,0,169,171,3,48,24,0,170,168,1,0,0,0,
        170,171,1,0,0,0,171,25,1,0,0,0,172,176,5,12,0,0,173,175,3,28,14,
        0,174,173,1,0,0,0,175,178,1,0,0,0,176,174,1,0,0,0,176,177,1,0,0,
        0,177,179,1,0,0,0,178,176,1,0,0,0,179,180,5,13,0,0,180,27,1,0,0,
        0,181,191,3,16,8,0,182,191,3,40,20,0,183,191,3,38,19,0,184,191,3,
        36,18,0,185,191,3,30,15,0,186,191,3,32,16,0,187,191,3,8,4,0,188,
        191,3,12,6,0,189,191,3,34,17,0,190,181,1,0,0,0,190,182,1,0,0,0,190,
        183,1,0,0,0,190,184,1,0,0,0,190,185,1,0,0,0,190,186,1,0,0,0,190,
        187,1,0,0,0,190,188,1,0,0,0,190,189,1,0,0,0,191,29,1,0,0,0,192,193,
        3,46,23,0,193,196,5,39,0,0,194,195,5,16,0,0,195,197,3,48,24,0,196,
        194,1,0,0,0,196,197,1,0,0,0,197,199,1,0,0,0,198,200,5,14,0,0,199,
        198,1,0,0,0,199,200,1,0,0,0,200,31,1,0,0,0,201,202,5,39,0,0,202,
        203,5,16,0,0,203,205,3,48,24,0,204,206,5,14,0,0,205,204,1,0,0,0,
        205,206,1,0,0,0,206,33,1,0,0,0,207,208,5,39,0,0,208,210,5,10,0,0,
        209,211,3,44,22,0,210,209,1,0,0,0,210,211,1,0,0,0,211,212,1,0,0,
        0,212,214,5,11,0,0,213,215,5,14,0,0,214,213,1,0,0,0,214,215,1,0,
        0,0,215,35,1,0,0,0,216,217,5,39,0,0,217,218,5,20,0,0,218,219,5,39,
        0,0,219,221,5,10,0,0,220,222,3,44,22,0,221,220,1,0,0,0,221,222,1,
        0,0,0,222,223,1,0,0,0,223,225,5,11,0,0,224,226,5,14,0,0,225,224,
        1,0,0,0,225,226,1,0,0,0,226,37,1,0,0,0,227,228,5,39,0,0,228,230,
        5,10,0,0,229,231,3,44,22,0,230,229,1,0,0,0,230,231,1,0,0,0,231,232,
        1,0,0,0,232,233,5,11,0,0,233,234,3,26,13,0,234,39,1,0,0,0,235,236,
        5,5,0,0,236,237,5,39,0,0,237,239,5,10,0,0,238,240,3,44,22,0,239,
        238,1,0,0,0,239,240,1,0,0,0,240,241,1,0,0,0,241,243,5,11,0,0,242,
        244,5,14,0,0,243,242,1,0,0,0,243,244,1,0,0,0,244,41,1,0,0,0,245,
        246,5,6,0,0,246,248,5,42,0,0,247,249,5,14,0,0,248,247,1,0,0,0,248,
        249,1,0,0,0,249,43,1,0,0,0,250,255,3,48,24,0,251,252,5,15,0,0,252,
        254,3,48,24,0,253,251,1,0,0,0,254,257,1,0,0,0,255,253,1,0,0,0,255,
        256,1,0,0,0,256,45,1,0,0,0,257,255,1,0,0,0,258,259,5,39,0,0,259,
        47,1,0,0,0,260,261,6,24,-1,0,261,262,5,10,0,0,262,263,3,48,24,0,
        263,264,5,11,0,0,264,287,1,0,0,0,265,266,3,50,25,0,266,268,5,10,
        0,0,267,269,3,44,22,0,268,267,1,0,0,0,268,269,1,0,0,0,269,270,1,
        0,0,0,270,271,5,11,0,0,271,287,1,0,0,0,272,287,3,50,25,0,273,287,
        5,41,0,0,274,287,5,42,0,0,275,287,5,38,0,0,276,287,3,52,26,0,277,
        278,5,39,0,0,278,279,5,16,0,0,279,287,3,48,24,12,280,281,5,29,0,
        0,281,287,3,48,24,11,282,283,5,7,0,0,283,287,3,48,24,10,284,285,
        5,22,0,0,285,287,3,48,24,9,286,260,1,0,0,0,286,265,1,0,0,0,286,272,
        1,0,0,0,286,273,1,0,0,0,286,274,1,0,0,0,286,275,1,0,0,0,286,276,
        1,0,0,0,286,277,1,0,0,0,286,280,1,0,0,0,286,282,1,0,0,0,286,284,
        1,0,0,0,287,317,1,0,0,0,288,289,10,8,0,0,289,290,7,0,0,0,290,316,
        3,48,24,9,291,292,10,7,0,0,292,293,7,1,0,0,293,316,3,48,24,8,294,
        295,10,6,0,0,295,296,5,27,0,0,296,316,3,48,24,7,297,298,10,5,0,0,
        298,299,5,28,0,0,299,316,3,48,24,6,300,301,10,4,0,0,301,302,7,2,
        0,0,302,316,3,48,24,5,303,304,10,3,0,0,304,305,5,25,0,0,305,316,
        3,48,24,4,306,307,10,2,0,0,307,308,5,26,0,0,308,316,3,48,24,3,309,
        310,10,1,0,0,310,311,5,30,0,0,311,312,3,48,24,0,312,313,5,31,0,0,
        313,314,3,48,24,2,314,316,1,0,0,0,315,288,1,0,0,0,315,291,1,0,0,
        0,315,294,1,0,0,0,315,297,1,0,0,0,315,300,1,0,0,0,315,303,1,0,0,
        0,315,306,1,0,0,0,315,309,1,0,0,0,316,319,1,0,0,0,317,315,1,0,0,
        0,317,318,1,0,0,0,318,49,1,0,0,0,319,317,1,0,0,0,320,325,5,39,0,
        0,321,322,5,19,0,0,322,324,5,39,0,0,323,321,1,0,0,0,324,327,1,0,
        0,0,325,323,1,0,0,0,325,326,1,0,0,0,326,51,1,0,0,0,327,325,1,0,0,
        0,328,330,5,17,0,0,329,331,3,44,22,0,330,329,1,0,0,0,330,331,1,0,
        0,0,331,332,1,0,0,0,332,333,5,18,0,0,333,53,1,0,0,0,36,57,73,78,
        86,92,98,102,109,115,127,135,139,151,154,163,170,176,190,196,199,
        205,210,214,221,225,230,239,243,248,255,268,286,315,317,325,330
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!TechlandScriptParser.__ATN) {
            TechlandScriptParser.__ATN = new antlr.ATNDeserializer().deserialize(TechlandScriptParser._serializedATN);
        }

        return TechlandScriptParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(TechlandScriptParser.literalNames, TechlandScriptParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return TechlandScriptParser.vocabulary;
    }

    private static readonly decisionsToDFA = TechlandScriptParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class FileContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.EOF, 0)!;
    }
    public definition(): DefinitionContext[];
    public definition(i: number): DefinitionContext | null;
    public definition(i?: number): DefinitionContext[] | DefinitionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(DefinitionContext);
        }

        return this.getRuleContext(i, DefinitionContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_file;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitFile) {
            return visitor.visitFile(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DefinitionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public importDecl(): ImportDeclContext | null {
        return this.getRuleContext(0, ImportDeclContext);
    }
    public exportDecl(): ExportDeclContext | null {
        return this.getRuleContext(0, ExportDeclContext);
    }
    public externDecl(): ExternDeclContext | null {
        return this.getRuleContext(0, ExternDeclContext);
    }
    public directiveCall(): DirectiveCallContext | null {
        return this.getRuleContext(0, DirectiveCallContext);
    }
    public useSemanticDecl(): UseSemanticDeclContext | null {
        return this.getRuleContext(0, UseSemanticDeclContext);
    }
    public macroDecl(): MacroDeclContext | null {
        return this.getRuleContext(0, MacroDeclContext);
    }
    public subDecl(): SubDeclContext | null {
        return this.getRuleContext(0, SubDeclContext);
    }
    public variableDecl(): VariableDeclContext | null {
        return this.getRuleContext(0, VariableDeclContext);
    }
    public functionBlockDecl(): FunctionBlockDeclContext | null {
        return this.getRuleContext(0, FunctionBlockDeclContext);
    }
    public methodReferenceFunCallDecl(): MethodReferenceFunCallDeclContext | null {
        return this.getRuleContext(0, MethodReferenceFunCallDeclContext);
    }
    public functionCallDecl(): FunctionCallDeclContext | null {
        return this.getRuleContext(0, FunctionCallDeclContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_definition;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitDefinition) {
            return visitor.visitDefinition(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ImportDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Import(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Import, 0)!;
    }
    public String(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.String, 0)!;
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_importDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitImportDecl) {
            return visitor.visitImportDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExportDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Export(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Export, 0)!;
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public Equals(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Equals, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_exportDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitExportDecl) {
            return visitor.visitExportDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExternDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Extern(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Extern, 0)!;
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_externDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitExternDecl) {
            return visitor.visitExternDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class DirectiveCallContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Exclamation(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Exclamation, 0)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_directiveCall;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitDirectiveCall) {
            return visitor.visitDirectiveCall(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MacroDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public MacroId(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.MacroId, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public valueList(): ValueListContext {
        return this.getRuleContext(0, ValueListContext)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_macroDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitMacroDecl) {
            return visitor.visitMacroDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class SubDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Sub(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Sub, 0)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public functionBlock(): FunctionBlockContext {
        return this.getRuleContext(0, FunctionBlockContext)!;
    }
    public paramList(): ParamListContext | null {
        return this.getRuleContext(0, ParamListContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_subDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitSubDecl) {
            return visitor.visitSubDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class LogicControlDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KwIf(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.KwIf, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public functionBlock(): FunctionBlockContext {
        return this.getRuleContext(0, FunctionBlockContext)!;
    }
    public Comma(): antlr.TerminalNode[];
    public Comma(i: number): antlr.TerminalNode | null;
    public Comma(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandScriptParser.Comma);
    	} else {
    		return this.getToken(TechlandScriptParser.Comma, i);
    	}
    }
    public elseIfClause(): ElseIfClauseContext[];
    public elseIfClause(i: number): ElseIfClauseContext | null;
    public elseIfClause(i?: number): ElseIfClauseContext[] | ElseIfClauseContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElseIfClauseContext);
        }

        return this.getRuleContext(i, ElseIfClauseContext);
    }
    public elseClause(): ElseClauseContext | null {
        return this.getRuleContext(0, ElseClauseContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_logicControlDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitLogicControlDecl) {
            return visitor.visitLogicControlDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElseIfClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KwElse(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.KwElse, 0)!;
    }
    public KwIf(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.KwIf, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public functionBlock(): FunctionBlockContext {
        return this.getRuleContext(0, FunctionBlockContext)!;
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_elseIfClause;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitElseIfClause) {
            return visitor.visitElseIfClause(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElseClauseContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public KwElse(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.KwElse, 0)!;
    }
    public functionBlock(): FunctionBlockContext {
        return this.getRuleContext(0, FunctionBlockContext)!;
    }
    public LParen(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.LParen, 0);
    }
    public RParen(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.RParen, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_elseClause;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitElseClause) {
            return visitor.visitElseClause(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public param(): ParamContext[];
    public param(i: number): ParamContext | null;
    public param(i?: number): ParamContext[] | ParamContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ParamContext);
        }

        return this.getRuleContext(i, ParamContext);
    }
    public Comma(): antlr.TerminalNode[];
    public Comma(i: number): antlr.TerminalNode | null;
    public Comma(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandScriptParser.Comma);
    	} else {
    		return this.getToken(TechlandScriptParser.Comma, i);
    	}
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_paramList;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitParamList) {
            return visitor.visitParamList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ParamContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public Equals(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Equals, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_param;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitParam) {
            return visitor.visitParam(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunctionBlockContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBrace(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LBrace, 0)!;
    }
    public RBrace(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RBrace, 0)!;
    }
    public statements(): StatementsContext[];
    public statements(i: number): StatementsContext | null;
    public statements(i?: number): StatementsContext[] | StatementsContext | null {
        if (i === undefined) {
            return this.getRuleContexts(StatementsContext);
        }

        return this.getRuleContext(i, StatementsContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_functionBlock;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitFunctionBlock) {
            return visitor.visitFunctionBlock(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class StatementsContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public logicControlDecl(): LogicControlDeclContext | null {
        return this.getRuleContext(0, LogicControlDeclContext);
    }
    public useDecl(): UseDeclContext | null {
        return this.getRuleContext(0, UseDeclContext);
    }
    public functionBlockDecl(): FunctionBlockDeclContext | null {
        return this.getRuleContext(0, FunctionBlockDeclContext);
    }
    public methodReferenceFunCallDecl(): MethodReferenceFunCallDeclContext | null {
        return this.getRuleContext(0, MethodReferenceFunCallDeclContext);
    }
    public variableDecl(): VariableDeclContext | null {
        return this.getRuleContext(0, VariableDeclContext);
    }
    public variableAssignDecl(): VariableAssignDeclContext | null {
        return this.getRuleContext(0, VariableAssignDeclContext);
    }
    public externDecl(): ExternDeclContext | null {
        return this.getRuleContext(0, ExternDeclContext);
    }
    public macroDecl(): MacroDeclContext | null {
        return this.getRuleContext(0, MacroDeclContext);
    }
    public functionCallDecl(): FunctionCallDeclContext | null {
        return this.getRuleContext(0, FunctionCallDeclContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_statements;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitStatements) {
            return visitor.visitStatements(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public type(): TypeContext {
        return this.getRuleContext(0, TypeContext)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public Equals(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Equals, 0);
    }
    public expression(): ExpressionContext | null {
        return this.getRuleContext(0, ExpressionContext);
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_variableDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitVariableDecl) {
            return visitor.visitVariableDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class VariableAssignDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public Equals(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Equals, 0)!;
    }
    public expression(): ExpressionContext {
        return this.getRuleContext(0, ExpressionContext)!;
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_variableAssignDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitVariableAssignDecl) {
            return visitor.visitVariableAssignDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunctionCallDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_functionCallDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitFunctionCallDecl) {
            return visitor.visitFunctionCallDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MethodReferenceFunCallDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Id(): antlr.TerminalNode[];
    public Id(i: number): antlr.TerminalNode | null;
    public Id(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandScriptParser.Id);
    	} else {
    		return this.getToken(TechlandScriptParser.Id, i);
    	}
    }
    public DoubleColon(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.DoubleColon, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_methodReferenceFunCallDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitMethodReferenceFunCallDecl) {
            return visitor.visitMethodReferenceFunCallDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FunctionBlockDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public functionBlock(): FunctionBlockContext {
        return this.getRuleContext(0, FunctionBlockContext)!;
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_functionBlockDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitFunctionBlockDecl) {
            return visitor.visitFunctionBlockDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class UseDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Use(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Use, 0)!;
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public LParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LParen, 0)!;
    }
    public RParen(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RParen, 0)!;
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_useDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitUseDecl) {
            return visitor.visitUseDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class UseSemanticDeclContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public UseSemantic(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.UseSemantic, 0)!;
    }
    public String(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.String, 0)!;
    }
    public Semicolon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Semicolon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_useSemanticDecl;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitUseSemanticDecl) {
            return visitor.visitUseSemanticDecl(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ValueListContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public Comma(): antlr.TerminalNode[];
    public Comma(i: number): antlr.TerminalNode | null;
    public Comma(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandScriptParser.Comma);
    	} else {
    		return this.getToken(TechlandScriptParser.Comma, i);
    	}
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_valueList;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitValueList) {
            return visitor.visitValueList(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class TypeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Id(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.Id, 0)!;
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_type;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitType) {
            return visitor.visitType(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ExpressionContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LParen(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.LParen, 0);
    }
    public expression(): ExpressionContext[];
    public expression(i: number): ExpressionContext | null;
    public expression(i?: number): ExpressionContext[] | ExpressionContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ExpressionContext);
        }

        return this.getRuleContext(i, ExpressionContext);
    }
    public RParen(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.RParen, 0);
    }
    public fieldAccess(): FieldAccessContext | null {
        return this.getRuleContext(0, FieldAccessContext);
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public Number(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Number, 0);
    }
    public String(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.String, 0);
    }
    public Bool(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Bool, 0);
    }
    public arrayValue(): ArrayValueContext | null {
        return this.getRuleContext(0, ArrayValueContext);
    }
    public Id(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Id, 0);
    }
    public Equals(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Equals, 0);
    }
    public BitNot(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.BitNot, 0);
    }
    public Exclamation(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Exclamation, 0);
    }
    public Minus(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Minus, 0);
    }
    public Mul(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Mul, 0);
    }
    public Div(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Div, 0);
    }
    public Plus(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Plus, 0);
    }
    public BitOr(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.BitOr, 0);
    }
    public BitAnd(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.BitAnd, 0);
    }
    public Gt(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Gt, 0);
    }
    public Lt(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Lt, 0);
    }
    public Gte(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Gte, 0);
    }
    public Lte(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Lte, 0);
    }
    public Eq(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Eq, 0);
    }
    public NotEq(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.NotEq, 0);
    }
    public LogicAnd(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.LogicAnd, 0);
    }
    public LogicOr(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.LogicOr, 0);
    }
    public Question(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Question, 0);
    }
    public Colon(): antlr.TerminalNode | null {
        return this.getToken(TechlandScriptParser.Colon, 0);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_expression;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitExpression) {
            return visitor.visitExpression(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class FieldAccessContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Id(): antlr.TerminalNode[];
    public Id(i: number): antlr.TerminalNode | null;
    public Id(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandScriptParser.Id);
    	} else {
    		return this.getToken(TechlandScriptParser.Id, i);
    	}
    }
    public Dot(): antlr.TerminalNode[];
    public Dot(i: number): antlr.TerminalNode | null;
    public Dot(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandScriptParser.Dot);
    	} else {
    		return this.getToken(TechlandScriptParser.Dot, i);
    	}
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_fieldAccess;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitFieldAccess) {
            return visitor.visitFieldAccess(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ArrayValueContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public LBracket(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.LBracket, 0)!;
    }
    public RBracket(): antlr.TerminalNode {
        return this.getToken(TechlandScriptParser.RBracket, 0)!;
    }
    public valueList(): ValueListContext | null {
        return this.getRuleContext(0, ValueListContext);
    }
    public override get ruleIndex(): number {
        return TechlandScriptParser.RULE_arrayValue;
    }
    public override accept<Result>(visitor: TechlandScriptVisitor<Result>): Result | null {
        if (visitor.visitArrayValue) {
            return visitor.visitArrayValue(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
