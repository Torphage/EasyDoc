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

    protected removeEscapeCharacters(text: string): string {
        let unescapedString = "";
        text = text.replace(/\\\\\\\}/g, "}");

        for (let i = 0; i < text.length; i++) {
            if (text[i] === "\\") {
                if (text[i - 1] === "\\" && text[i + 1] === "\\") {
                    unescapedString += text[i];
                    i++;
                }
            } else {
                unescapedString += text[i];
            }
        }

        return unescapedString;
    }

    protected abstract applyType(text: string): vs.SnippetString;
    protected abstract getType(types: ISyntaxType[], index: number): ISyntaxType;
    protected abstract getTypeText(types: ISyntaxType): any;
}
