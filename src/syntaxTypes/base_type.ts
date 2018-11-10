import * as vs from "vscode";
import { CustomSyntax } from "../syntax";
import { ISyntaxType, ISyntaxVariable } from "../types";

export abstract class BaseSyntaxType {
    protected customTypes: CustomSyntax;
    protected vars: ISyntaxVariable;

    constructor(vars?: ISyntaxVariable) {
        this.customTypes = new CustomSyntax();
        this.vars = vars;
    }

    protected isNewLine(text: string, index: number) {
        if (text[index - 1] === ("\n" || undefined)) {
            return true;
        }

        return false;
    }

    protected abstract applyType(text: string): any;
    protected abstract getType(types: ISyntaxType[], index: number): ISyntaxType;
    protected abstract getTypeValue(types: ISyntaxType, name?: string): any;
}
