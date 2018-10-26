import { ISyntaxVariable } from "../../types";
import { WorkShop } from "../workshop";
import { RubyParse } from "./parse";

export class Ruby extends WorkShop {
    protected parse: RubyParse;

    constructor(syntaxFile: string) {
        super(syntaxFile);
        this.parse = new RubyParse();
    }

    public getFunctionLines(rows: string): string[] {
        if (this.config.commentAboveTarget) {
            const functionLine = this.position.line + 1;
            const functionLineString = rows.split("\n").splice(functionLine);
            return functionLineString;
        } else {
            const functionLine = this.position.line - 1;
            const functionLineString = rows.split("\n").splice(functionLine);
            return functionLineString;
        }
    }

    public correctlyPlacedFunction(functionLine: string): boolean {
        const regex = /^\s*def\s/g;
        if (regex.exec(functionLine) !== null) {
            return true;
        } else {
            return false;
        }
    }

    public getVariables(): ISyntaxVariable {
        const variables: ISyntaxVariable = {
            NAME: this.parse.parseName(this.block),
            PARAMS: this.parse.parseParams(this.block),
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
