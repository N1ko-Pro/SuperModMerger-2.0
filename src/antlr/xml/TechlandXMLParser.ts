
import * as antlr from "antlr4ng";
import { Token } from "antlr4ng";

import { TechlandXMLParserVisitor } from "./TechlandXMLParserVisitor.js";

// for running tests with parameters, TODO: discuss strategy for typed parameters in CI
// eslint-disable-next-line no-unused-vars
type int = number;


export class TechlandXMLParser extends antlr.Parser {
    public static readonly COMMENT = 1;
    public static readonly CDATA = 2;
    public static readonly DTD = 3;
    public static readonly EntityRef = 4;
    public static readonly CharRef = 5;
    public static readonly SEA_WS = 6;
    public static readonly OPEN = 7;
    public static readonly XMLDeclOpen = 8;
    public static readonly TEXT = 9;
    public static readonly CLOSE = 10;
    public static readonly SPECIAL_CLOSE = 11;
    public static readonly SLASH_CLOSE = 12;
    public static readonly SLASH = 13;
    public static readonly EQUALS = 14;
    public static readonly STRING = 15;
    public static readonly Name = 16;
    public static readonly S = 17;
    public static readonly PI = 18;
    public static readonly RULE_document = 0;
    public static readonly RULE_prolog = 1;
    public static readonly RULE_content = 2;
    public static readonly RULE_element = 3;
    public static readonly RULE_reference = 4;
    public static readonly RULE_attribute = 5;
    public static readonly RULE_chardata = 6;
    public static readonly RULE_misc = 7;

    public static readonly literalNames = [
        null, null, null, null, null, null, null, "'<'", null, null, "'>'", 
        null, "'/>'", "'/'", "'='"
    ];

    public static readonly symbolicNames = [
        null, "COMMENT", "CDATA", "DTD", "EntityRef", "CharRef", "SEA_WS", 
        "OPEN", "XMLDeclOpen", "TEXT", "CLOSE", "SPECIAL_CLOSE", "SLASH_CLOSE", 
        "SLASH", "EQUALS", "STRING", "Name", "S", "PI"
    ];
    public static readonly ruleNames = [
        "document", "prolog", "content", "element", "reference", "attribute", 
        "chardata", "misc",
    ];

    public get grammarFileName(): string { return "TechlandXMLParser.g4"; }
    public get literalNames(): (string | null)[] { return TechlandXMLParser.literalNames; }
    public get symbolicNames(): (string | null)[] { return TechlandXMLParser.symbolicNames; }
    public get ruleNames(): string[] { return TechlandXMLParser.ruleNames; }
    public get serializedATN(): number[] { return TechlandXMLParser._serializedATN; }

    protected createFailedPredicateException(predicate?: string, message?: string): antlr.FailedPredicateException {
        return new antlr.FailedPredicateException(this, predicate, message);
    }

    public constructor(input: antlr.TokenStream) {
        super(input);
        this.interpreter = new antlr.ParserATNSimulator(this, TechlandXMLParser._ATN, TechlandXMLParser.decisionsToDFA, new antlr.PredictionContextCache());
    }
    public document(): DocumentContext {
        let localContext = new DocumentContext(this.context, this.state);
        this.enterRule(localContext, 0, TechlandXMLParser.RULE_document);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 17;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 8) {
                {
                this.state = 16;
                this.prolog();
                }
            }

            this.state = 23;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while ((((_la) & ~0x1F) === 0 && ((1 << _la) & 262338) !== 0)) {
                {
                this.state = 21;
                this.errorHandler.sync(this);
                switch (this.tokenStream.LA(1)) {
                case TechlandXMLParser.COMMENT:
                case TechlandXMLParser.SEA_WS:
                case TechlandXMLParser.PI:
                    {
                    this.state = 19;
                    this.misc();
                    }
                    break;
                case TechlandXMLParser.OPEN:
                    {
                    this.state = 20;
                    this.element();
                    }
                    break;
                default:
                    throw new antlr.NoViableAltException(this);
                }
                }
                this.state = 25;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 26;
            this.match(TechlandXMLParser.EOF);
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
    public prolog(): PrologContext {
        let localContext = new PrologContext(this.context, this.state);
        this.enterRule(localContext, 2, TechlandXMLParser.RULE_prolog);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 28;
            this.match(TechlandXMLParser.XMLDeclOpen);
            this.state = 32;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            while (_la === 16) {
                {
                {
                this.state = 29;
                this.attribute();
                }
                }
                this.state = 34;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
            }
            this.state = 35;
            this.match(TechlandXMLParser.SPECIAL_CLOSE);
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
    public content(): ContentContext {
        let localContext = new ContentContext(this.context, this.state);
        this.enterRule(localContext, 4, TechlandXMLParser.RULE_content);
        let _la: number;
        try {
            let alternative: number;
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 38;
            this.errorHandler.sync(this);
            _la = this.tokenStream.LA(1);
            if (_la === 6 || _la === 9) {
                {
                this.state = 37;
                this.chardata();
                }
            }

            this.state = 52;
            this.errorHandler.sync(this);
            alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
            while (alternative !== 2 && alternative !== antlr.ATN.INVALID_ALT_NUMBER) {
                if (alternative === 1) {
                    {
                    {
                    this.state = 45;
                    this.errorHandler.sync(this);
                    switch (this.tokenStream.LA(1)) {
                    case TechlandXMLParser.OPEN:
                        {
                        this.state = 40;
                        this.element();
                        }
                        break;
                    case TechlandXMLParser.EntityRef:
                    case TechlandXMLParser.CharRef:
                        {
                        this.state = 41;
                        this.reference();
                        }
                        break;
                    case TechlandXMLParser.CDATA:
                        {
                        this.state = 42;
                        this.match(TechlandXMLParser.CDATA);
                        }
                        break;
                    case TechlandXMLParser.PI:
                        {
                        this.state = 43;
                        this.match(TechlandXMLParser.PI);
                        }
                        break;
                    case TechlandXMLParser.COMMENT:
                        {
                        this.state = 44;
                        this.match(TechlandXMLParser.COMMENT);
                        }
                        break;
                    default:
                        throw new antlr.NoViableAltException(this);
                    }
                    this.state = 48;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                    if (_la === 6 || _la === 9) {
                        {
                        this.state = 47;
                        this.chardata();
                        }
                    }

                    }
                    }
                }
                this.state = 54;
                this.errorHandler.sync(this);
                alternative = this.interpreter.adaptivePredict(this.tokenStream, 7, this.context);
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
    public element(): ElementContext {
        let localContext = new ElementContext(this.context, this.state);
        this.enterRule(localContext, 6, TechlandXMLParser.RULE_element);
        let _la: number;
        try {
            this.state = 79;
            this.errorHandler.sync(this);
            switch (this.interpreter.adaptivePredict(this.tokenStream, 10, this.context) ) {
            case 1:
                this.enterOuterAlt(localContext, 1);
                {
                this.state = 55;
                this.match(TechlandXMLParser.OPEN);
                this.state = 56;
                this.match(TechlandXMLParser.Name);
                this.state = 60;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 16) {
                    {
                    {
                    this.state = 57;
                    this.attribute();
                    }
                    }
                    this.state = 62;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 63;
                this.match(TechlandXMLParser.CLOSE);
                this.state = 64;
                this.content();
                this.state = 65;
                this.match(TechlandXMLParser.OPEN);
                this.state = 66;
                this.match(TechlandXMLParser.SLASH);
                this.state = 67;
                this.match(TechlandXMLParser.Name);
                this.state = 68;
                this.match(TechlandXMLParser.CLOSE);
                }
                break;
            case 2:
                this.enterOuterAlt(localContext, 2);
                {
                this.state = 70;
                this.match(TechlandXMLParser.OPEN);
                this.state = 71;
                this.match(TechlandXMLParser.Name);
                this.state = 75;
                this.errorHandler.sync(this);
                _la = this.tokenStream.LA(1);
                while (_la === 16) {
                    {
                    {
                    this.state = 72;
                    this.attribute();
                    }
                    }
                    this.state = 77;
                    this.errorHandler.sync(this);
                    _la = this.tokenStream.LA(1);
                }
                this.state = 78;
                this.match(TechlandXMLParser.SLASH_CLOSE);
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
    public reference(): ReferenceContext {
        let localContext = new ReferenceContext(this.context, this.state);
        this.enterRule(localContext, 8, TechlandXMLParser.RULE_reference);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 81;
            _la = this.tokenStream.LA(1);
            if(!(_la === 4 || _la === 5)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
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
    public attribute(): AttributeContext {
        let localContext = new AttributeContext(this.context, this.state);
        this.enterRule(localContext, 10, TechlandXMLParser.RULE_attribute);
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 83;
            this.match(TechlandXMLParser.Name);
            this.state = 84;
            this.match(TechlandXMLParser.EQUALS);
            this.state = 85;
            this.match(TechlandXMLParser.STRING);
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
    public chardata(): ChardataContext {
        let localContext = new ChardataContext(this.context, this.state);
        this.enterRule(localContext, 12, TechlandXMLParser.RULE_chardata);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 87;
            _la = this.tokenStream.LA(1);
            if(!(_la === 6 || _la === 9)) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
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
    public misc(): MiscContext {
        let localContext = new MiscContext(this.context, this.state);
        this.enterRule(localContext, 14, TechlandXMLParser.RULE_misc);
        let _la: number;
        try {
            this.enterOuterAlt(localContext, 1);
            {
            this.state = 89;
            _la = this.tokenStream.LA(1);
            if(!((((_la) & ~0x1F) === 0 && ((1 << _la) & 262210) !== 0))) {
            this.errorHandler.recoverInline(this);
            }
            else {
                this.errorHandler.reportMatch(this);
                this.consume();
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

    public static readonly _serializedATN: number[] = [
        4,1,18,92,2,0,7,0,2,1,7,1,2,2,7,2,2,3,7,3,2,4,7,4,2,5,7,5,2,6,7,
        6,2,7,7,7,1,0,3,0,18,8,0,1,0,1,0,5,0,22,8,0,10,0,12,0,25,9,0,1,0,
        1,0,1,1,1,1,5,1,31,8,1,10,1,12,1,34,9,1,1,1,1,1,1,2,3,2,39,8,2,1,
        2,1,2,1,2,1,2,1,2,3,2,46,8,2,1,2,3,2,49,8,2,5,2,51,8,2,10,2,12,2,
        54,9,2,1,3,1,3,1,3,5,3,59,8,3,10,3,12,3,62,9,3,1,3,1,3,1,3,1,3,1,
        3,1,3,1,3,1,3,1,3,1,3,5,3,74,8,3,10,3,12,3,77,9,3,1,3,3,3,80,8,3,
        1,4,1,4,1,5,1,5,1,5,1,5,1,6,1,6,1,7,1,7,1,7,0,0,8,0,2,4,6,8,10,12,
        14,0,3,1,0,4,5,2,0,6,6,9,9,3,0,1,1,6,6,18,18,97,0,17,1,0,0,0,2,28,
        1,0,0,0,4,38,1,0,0,0,6,79,1,0,0,0,8,81,1,0,0,0,10,83,1,0,0,0,12,
        87,1,0,0,0,14,89,1,0,0,0,16,18,3,2,1,0,17,16,1,0,0,0,17,18,1,0,0,
        0,18,23,1,0,0,0,19,22,3,14,7,0,20,22,3,6,3,0,21,19,1,0,0,0,21,20,
        1,0,0,0,22,25,1,0,0,0,23,21,1,0,0,0,23,24,1,0,0,0,24,26,1,0,0,0,
        25,23,1,0,0,0,26,27,5,0,0,1,27,1,1,0,0,0,28,32,5,8,0,0,29,31,3,10,
        5,0,30,29,1,0,0,0,31,34,1,0,0,0,32,30,1,0,0,0,32,33,1,0,0,0,33,35,
        1,0,0,0,34,32,1,0,0,0,35,36,5,11,0,0,36,3,1,0,0,0,37,39,3,12,6,0,
        38,37,1,0,0,0,38,39,1,0,0,0,39,52,1,0,0,0,40,46,3,6,3,0,41,46,3,
        8,4,0,42,46,5,2,0,0,43,46,5,18,0,0,44,46,5,1,0,0,45,40,1,0,0,0,45,
        41,1,0,0,0,45,42,1,0,0,0,45,43,1,0,0,0,45,44,1,0,0,0,46,48,1,0,0,
        0,47,49,3,12,6,0,48,47,1,0,0,0,48,49,1,0,0,0,49,51,1,0,0,0,50,45,
        1,0,0,0,51,54,1,0,0,0,52,50,1,0,0,0,52,53,1,0,0,0,53,5,1,0,0,0,54,
        52,1,0,0,0,55,56,5,7,0,0,56,60,5,16,0,0,57,59,3,10,5,0,58,57,1,0,
        0,0,59,62,1,0,0,0,60,58,1,0,0,0,60,61,1,0,0,0,61,63,1,0,0,0,62,60,
        1,0,0,0,63,64,5,10,0,0,64,65,3,4,2,0,65,66,5,7,0,0,66,67,5,13,0,
        0,67,68,5,16,0,0,68,69,5,10,0,0,69,80,1,0,0,0,70,71,5,7,0,0,71,75,
        5,16,0,0,72,74,3,10,5,0,73,72,1,0,0,0,74,77,1,0,0,0,75,73,1,0,0,
        0,75,76,1,0,0,0,76,78,1,0,0,0,77,75,1,0,0,0,78,80,5,12,0,0,79,55,
        1,0,0,0,79,70,1,0,0,0,80,7,1,0,0,0,81,82,7,0,0,0,82,9,1,0,0,0,83,
        84,5,16,0,0,84,85,5,14,0,0,85,86,5,15,0,0,86,11,1,0,0,0,87,88,7,
        1,0,0,88,13,1,0,0,0,89,90,7,2,0,0,90,15,1,0,0,0,11,17,21,23,32,38,
        45,48,52,60,75,79
    ];

    private static __ATN: antlr.ATN;
    public static get _ATN(): antlr.ATN {
        if (!TechlandXMLParser.__ATN) {
            TechlandXMLParser.__ATN = new antlr.ATNDeserializer().deserialize(TechlandXMLParser._serializedATN);
        }

        return TechlandXMLParser.__ATN;
    }


    private static readonly vocabulary = new antlr.Vocabulary(TechlandXMLParser.literalNames, TechlandXMLParser.symbolicNames, []);

    public override get vocabulary(): antlr.Vocabulary {
        return TechlandXMLParser.vocabulary;
    }

    private static readonly decisionsToDFA = TechlandXMLParser._ATN.decisionToState.map( (ds: antlr.DecisionState, index: number) => new antlr.DFA(ds, index) );
}

export class DocumentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EOF(): antlr.TerminalNode {
        return this.getToken(TechlandXMLParser.EOF, 0)!;
    }
    public prolog(): PrologContext | null {
        return this.getRuleContext(0, PrologContext);
    }
    public misc(): MiscContext[];
    public misc(i: number): MiscContext | null;
    public misc(i?: number): MiscContext[] | MiscContext | null {
        if (i === undefined) {
            return this.getRuleContexts(MiscContext);
        }

        return this.getRuleContext(i, MiscContext);
    }
    public element(): ElementContext[];
    public element(i: number): ElementContext | null;
    public element(i?: number): ElementContext[] | ElementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElementContext);
        }

        return this.getRuleContext(i, ElementContext);
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_document;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitDocument) {
            return visitor.visitDocument(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class PrologContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public XMLDeclOpen(): antlr.TerminalNode {
        return this.getToken(TechlandXMLParser.XMLDeclOpen, 0)!;
    }
    public SPECIAL_CLOSE(): antlr.TerminalNode {
        return this.getToken(TechlandXMLParser.SPECIAL_CLOSE, 0)!;
    }
    public attribute(): AttributeContext[];
    public attribute(i: number): AttributeContext | null;
    public attribute(i?: number): AttributeContext[] | AttributeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AttributeContext);
        }

        return this.getRuleContext(i, AttributeContext);
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_prolog;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitProlog) {
            return visitor.visitProlog(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ContentContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public chardata(): ChardataContext[];
    public chardata(i: number): ChardataContext | null;
    public chardata(i?: number): ChardataContext[] | ChardataContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ChardataContext);
        }

        return this.getRuleContext(i, ChardataContext);
    }
    public element(): ElementContext[];
    public element(i: number): ElementContext | null;
    public element(i?: number): ElementContext[] | ElementContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ElementContext);
        }

        return this.getRuleContext(i, ElementContext);
    }
    public reference(): ReferenceContext[];
    public reference(i: number): ReferenceContext | null;
    public reference(i?: number): ReferenceContext[] | ReferenceContext | null {
        if (i === undefined) {
            return this.getRuleContexts(ReferenceContext);
        }

        return this.getRuleContext(i, ReferenceContext);
    }
    public CDATA(): antlr.TerminalNode[];
    public CDATA(i: number): antlr.TerminalNode | null;
    public CDATA(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandXMLParser.CDATA);
    	} else {
    		return this.getToken(TechlandXMLParser.CDATA, i);
    	}
    }
    public PI(): antlr.TerminalNode[];
    public PI(i: number): antlr.TerminalNode | null;
    public PI(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandXMLParser.PI);
    	} else {
    		return this.getToken(TechlandXMLParser.PI, i);
    	}
    }
    public COMMENT(): antlr.TerminalNode[];
    public COMMENT(i: number): antlr.TerminalNode | null;
    public COMMENT(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandXMLParser.COMMENT);
    	} else {
    		return this.getToken(TechlandXMLParser.COMMENT, i);
    	}
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_content;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitContent) {
            return visitor.visitContent(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ElementContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public OPEN(): antlr.TerminalNode[];
    public OPEN(i: number): antlr.TerminalNode | null;
    public OPEN(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandXMLParser.OPEN);
    	} else {
    		return this.getToken(TechlandXMLParser.OPEN, i);
    	}
    }
    public Name(): antlr.TerminalNode[];
    public Name(i: number): antlr.TerminalNode | null;
    public Name(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandXMLParser.Name);
    	} else {
    		return this.getToken(TechlandXMLParser.Name, i);
    	}
    }
    public CLOSE(): antlr.TerminalNode[];
    public CLOSE(i: number): antlr.TerminalNode | null;
    public CLOSE(i?: number): antlr.TerminalNode | null | antlr.TerminalNode[] {
    	if (i === undefined) {
    		return this.getTokens(TechlandXMLParser.CLOSE);
    	} else {
    		return this.getToken(TechlandXMLParser.CLOSE, i);
    	}
    }
    public content(): ContentContext | null {
        return this.getRuleContext(0, ContentContext);
    }
    public SLASH(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.SLASH, 0);
    }
    public attribute(): AttributeContext[];
    public attribute(i: number): AttributeContext | null;
    public attribute(i?: number): AttributeContext[] | AttributeContext | null {
        if (i === undefined) {
            return this.getRuleContexts(AttributeContext);
        }

        return this.getRuleContext(i, AttributeContext);
    }
    public SLASH_CLOSE(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.SLASH_CLOSE, 0);
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_element;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitElement) {
            return visitor.visitElement(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ReferenceContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public EntityRef(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.EntityRef, 0);
    }
    public CharRef(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.CharRef, 0);
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_reference;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitReference) {
            return visitor.visitReference(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class AttributeContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public Name(): antlr.TerminalNode {
        return this.getToken(TechlandXMLParser.Name, 0)!;
    }
    public EQUALS(): antlr.TerminalNode {
        return this.getToken(TechlandXMLParser.EQUALS, 0)!;
    }
    public STRING(): antlr.TerminalNode {
        return this.getToken(TechlandXMLParser.STRING, 0)!;
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_attribute;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitAttribute) {
            return visitor.visitAttribute(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class ChardataContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public TEXT(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.TEXT, 0);
    }
    public SEA_WS(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.SEA_WS, 0);
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_chardata;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitChardata) {
            return visitor.visitChardata(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}


export class MiscContext extends antlr.ParserRuleContext {
    public constructor(parent: antlr.ParserRuleContext | null, invokingState: number) {
        super(parent, invokingState);
    }
    public COMMENT(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.COMMENT, 0);
    }
    public PI(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.PI, 0);
    }
    public SEA_WS(): antlr.TerminalNode | null {
        return this.getToken(TechlandXMLParser.SEA_WS, 0);
    }
    public override get ruleIndex(): number {
        return TechlandXMLParser.RULE_misc;
    }
    public override accept<Result>(visitor: TechlandXMLParserVisitor<Result>): Result | null {
        if (visitor.visitMisc) {
            return visitor.visitMisc(this);
        } else {
            return visitor.visitChildren(this);
        }
    }
}
