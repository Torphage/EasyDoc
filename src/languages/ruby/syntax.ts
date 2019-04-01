import { ISyntaxVariable } from "../../interfaces";
import { WorkShop } from "../workshop";
import { RubyParse } from "./parse";

export class Ruby extends WorkShop {
    protected parse: RubyParse;

    constructor(syntaxFile: string, docType: string) {
        super(syntaxFile);
        this.parse = new RubyParse(docType);
    }

    public correctlyPlacedFunction(functionLineIndex: string): boolean {
        const regex = /^\s*def\s/g;

        if (regex.exec(functionLineIndex) !== null) {
            return true;
        } else {
            return false;
        }
    }

    public getVariables(): ISyntaxVariable {
        const variables: ISyntaxVariable = {
            NAME: this.parse.parseName(this.block),
            PARAMS: this.parse.parseParams(this.block).paramList,
            PARAMS_TEMPLATE: this.parse.parseParamsTemplate(this.block),
            BLOCK_COMMENT_START: this.getComment("BLOCK_COMMENT_START"),
            BLOCK_COMMENT_END: this.getComment("BLOCK_COMMENT_END"),
            COMMENT: this.getComment("COMMENT"),
        };

        return variables;
    }

    public getCurrentColumn(index: number): number {
        const leftOfCurrentPos = this.syntaxFile.slice(0, index);
        const leftIndex = leftOfCurrentPos.lastIndexOf("\n");
        const currentColumn = leftOfCurrentPos.length - leftIndex;
        return currentColumn;
    }
}
