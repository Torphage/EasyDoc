import * as vs from "vscode";
import { ISyntaxType, ISyntaxVariable } from "../types";
import { BaseSyntaxType } from "./base_type";

export class Variable extends BaseSyntaxType {
    constructor(vars: ISyntaxVariable) {
        super(vars);
    }

    public applyType(unescapedText: string): vs.SnippetString {
        const snippet = new vs.SnippetString();
        const text = this.removeEscapeCharacters(unescapedText);
        const variables = this.customTypes.getSyntax(text, "variables");

        for (let i = 0; i < text.length; i++) {
            const variable = this.getType(variables, i);

            if (variable) {
                const snippetStr = this.getTypeText(variable);
                const value = this.vars[snippetStr];
                const cleanStr = this.removeEscapeCharacters(value);

                snippet.appendText(cleanStr);

                i += snippetStr.length + 2;

                continue;
            }

            if (this.isNewLine(text, i)) {
                const currentLine = this.getCurrentLine(text, i);

                if (this.typeInLine(currentLine)) {
                    const snippetStr = this.createType(variables, i, currentLine);
                    const cleanStr = this.removeEscapeCharacters(snippetStr);

                    snippet.appendText(cleanStr);

                    i += currentLine.length;

                    continue;
                }
            }

            snippet.appendText(text[i]);
        }

        return snippet;
    }

    protected getType(variables: ISyntaxType[], index: number): ISyntaxType {
        for (const variable of variables) {
            if (variable.start === index) {
                if (variable.text.slice(2, -1) in this.vars) {
                    return variable;
                }
            }
        }
    }

    protected createType(variables: ISyntaxType[], index: number, text: string): string {
        const localVars = this.getLocalTypes(text, variables, index);
        const maxRepeaters = this.maxNumOfType(localVars);

        let str = [];

        for (const variable of localVars) {
            const newVar = this.vars[variable.text.slice(2, -1)];

            const tempStr = []
            if (typeof newVar === "string") {
                text = text.replace(variable.text, newVar);
                const temp = this.applyType(text);

                tempStr.push(temp.value);
                str = tempStr;

                continue;
            }

            for (let i = 0; i < maxRepeaters.length; i++) {
                if (newVar.length === maxRepeaters.length) {
                    const newText = text.replace(variable.text, newVar[i]);
                    const temp = this.applyType(newText);

                    tempStr.push(temp.value);

                } else {
                    const newText = text.replace(variable.text, newVar[0]);
                    const temp = this.applyType(newText);

                    tempStr.push(temp.value);
                }
            }

            str = tempStr;
        }

        return str.join("\n");
    }

    protected getTypeText(variable: ISyntaxType): string {
        const variableString = variable.text.slice(2, -1);

        return variableString;
    }

    private getLocalTypes(text: string, variables: ISyntaxType[], index: number): any {
        const includedVars = [];

        for (const variable of variables) {
            if (variable.start > index && variable.start + variable.length < index + text.length) {
                if (variable.text.slice(2, -1) in this.vars) {
                    includedVars.push(variable);
                }
            }
        }

        return includedVars;
    }
}
