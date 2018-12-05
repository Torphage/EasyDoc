import { ISyntaxVariable } from "../../interfaces";
import { WorkShop } from "../workshop";
import { HaskellParse } from "./parse";

export class Haskell extends WorkShop {
    protected parse: HaskellParse;

    constructor(syntaxFile: string) {
        super(syntaxFile);
        this.parse = new HaskellParse();
    }

    public getFunctionStartLine(rows: string, onEnter: boolean): string[] {
        let functionLineIndex: number;

        if (!onEnter) {
            functionLineIndex = this.position.line;
        } else if (this.config.commentAboveTarget) {
            functionLineIndex = this.position.line + 1;
        } else {
            functionLineIndex = this.position.line - 1;
        }

        const functionLineString = rows.split("\n").splice(functionLineIndex);

        return functionLineString;
    }

    public correctlyPlacedFunction(functionLineIndex: string): boolean {
        const regex = /= do\s*$/g;

        if (regex.exec(functionLineIndex) !== null) {
            return true;
        } else {
            return false;
        }
    }

    public getVariables(): ISyntaxVariable {
        const variables: ISyntaxVariable = {
            NAME: this.parse.parseName(this.block),
            PARAMS: this.parse.parseParams(this.block),
            PARAMS_TEMPLATE: this.parse.parseParamsTemplate(this.block),
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
