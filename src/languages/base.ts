import { ISyntaxVariable } from "../interfaces";
import { WorkShop } from "./workshop";

export class Base extends WorkShop {
    constructor(syntaxFile: string) {
        super(syntaxFile);
    }

    public getFunctionStartLine(rows: string): string[] { return; }
    public correctlyPlacedFunction(functionLineIndex: string): boolean { return; }
    public getCurrentColumn(index: number): number { return; }
    public getVariables(): ISyntaxVariable {
        const variables: ISyntaxVariable = {
            BLOCK_COMMENT_START: this.getComment("BLOCK_COMMENT_START"),
            BLOCK_COMMENT_END: this.getComment("BLOCK_COMMENT_END"),
            COMMENT: this.getComment("COMMENT"),
        };

        return variables;
    }
}
