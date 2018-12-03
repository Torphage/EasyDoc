import { ISyntaxVariable } from "../interfaces";
import { WorkShop } from "./workshop";

export class Base extends WorkShop {
    constructor(syntaxFile: string) {
        super(syntaxFile);
    }

    public getFunctionStartLine(rows: string): string[] { return; }
    public correctlyPlacedFunction(functionLineIndex: string): boolean { return; }
    public getVariables(): ISyntaxVariable { return; }
    public getCurrentColumn(index: number): number { return; }
}
