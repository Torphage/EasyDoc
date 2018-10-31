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

    protected getCurrentLine(syntaxText: string, index: number): string {
        const leftOfCurrentPos = syntaxText.slice(0, index);
        const leftIndex = leftOfCurrentPos.lastIndexOf("\n");

        const rightOfCurrentPos = syntaxText.slice(index);
        const rightIndex = rightOfCurrentPos.indexOf("\n");

        let fullLine: string;

        if (rightIndex !== -1) {
            fullLine = syntaxText.substring(leftIndex, leftOfCurrentPos.length + rightIndex);
        } else {
            fullLine = syntaxText.substring(leftOfCurrentPos.length + 2);
        }

        return fullLine.trim();
    }

    protected typeInLine(text: string) {
        for (const key in this.vars) {
            if (text.includes(`\${${key}}`) && !(text.includes(`\\\${${key}}`))) {
                return true;
            }
        }

        return false;
    }

    protected maxNumOfType(vars: any[]): any {
        let maxRepeaters = 0;

        vars.forEach((locals) => {
            if (typeof locals !== "string") {
                const variable = this.vars[locals.text.slice(2, -1)];

                if (variable.length > maxRepeaters) {
                    maxRepeaters = variable;
                }
            }
        });

        return maxRepeaters;
    }

    protected abstract applyType(text: string, alreadyEscaped?: boolean): vs.SnippetString;
    protected abstract getType(types: ISyntaxType[], index: number): ISyntaxType;
    protected abstract getTypeText(types: ISyntaxType): any;
}
