import type { CommonTokenStream } from "antlr4ng";
import type { BaseTreeNode } from "./baseTreeNode.js";
import type { MergedHistory } from "./mergerContext.js";

export interface ParsedResult<N extends BaseTreeNode> {
 astNode: N;
 tokenStream: CommonTokenStream;
}

export interface MergeResult {
 mergedContent: string;
 mergedHistory: MergedHistory;
}
