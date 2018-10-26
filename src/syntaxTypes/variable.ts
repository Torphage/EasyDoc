import * as vs from "vscode";
import { ISyntaxVariable } from "../types";
import { BaseSyntaxType } from "./base_type";

export class Variable extends BaseSyntaxType {
    constructor(vars: ISyntaxVariable) {
        super(vars);
    }

    public applyType(unexcapedText: string): vs.SnippetString {
        const snippet = new vs.SnippetString();
        const text = this.removeEscapeCharacters(unexcapedText);
        for (let i = 0; i < text.length; i++) {
            if (this.isNewLine(text, i)) {
                const currentLine = this.getCurrentLine(text, i);
                if (this.typeInLine(currentLine)) {
                    const snippetStr = this.createType(currentLine, i);
                    snippet.appendText(
                        this.removeEscapeCharacters(snippetStr),
                    );
                    i += currentLine.length;
                } else {
                    snippet.appendText(text[i]);
                }
            } else {
                snippet.appendText(text[i]);
            }
        }
        return snippet;
    }

    protected isType(text: string, index: number): boolean {
        const variables = this.customTypes.getSyntax(text, "variables");
        for (const variable of variables) {
            if (variable.start === index) {
                return true;
            }
        }
        return false;
    }

    protected getType(text: string, index: number, type: string): any {
        const includedVars = [];
        this.customTypes.getSyntax(text, type).forEach((obj) => {
            if (text.includes(obj.text)) {
                for (const key in this.vars) {
                    if (obj.text.includes(key)) {
                        includedVars.push(obj);
                    }
                }
            }
        });
        return includedVars;
    }

    protected createType(text: string, index: number): string {
        const str = [];
        const localVars = this.getType(text, undefined, "variables");
        const maxRepetitions = this.maxNumOfType(localVars);

        localVars.forEach((variable) => {
            const newVar = this.vars[variable.text.slice(2, -1)];

            if (typeof newVar === "string") {
                const newStr = text.replace(variable.text, newVar);
                const temp = this.applyType(newStr);
                str.push(temp.value);

            } else {
                for (let i = 0; i < maxRepetitions; i++) {

                    if (newVar.length === maxRepetitions) {
                        const newStr = text.replace(variable.text, newVar[i]);
                        const temp = this.applyType(newStr);
                        str.push(temp.value);

                    } else {
                        const newStr = text.replace(variable.text, newVar[0]);
                        const temp = this.applyType(newStr);
                        str.push(temp.value);
                    }
                }
            }
        });
        return str.join("\n");
    }
}
