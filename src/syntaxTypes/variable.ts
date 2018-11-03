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

            if (this.isNewLine(text, i)) {
                const currentLine = this.getCurrentLine(text, i);

                if (this.typeInLine(currentLine)) {
                    const snippetStr = this.createType(variables, i, currentLine);

                    snippet.appendText(snippetStr);

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

        let repeatEachLine: boolean;
        let str: string[] = [];
        let offset = -index;

        const arrayVars = this.getArrayVars(localVars);

        if (arrayVars.length > 0) {
            repeatEachLine = true;
            str = new Array(maxRepeaters.length).fill(text);
        }

        localVars.forEach((variable) => {
            const newVar = this.vars[variable.text.slice(2, -1)];
            const first = text.substring(0, variable.start + offset);
            const second = text.substring(variable.start + variable.length + offset);

            if (typeof newVar === "string") {
                if (repeatEachLine) {
                    for (let i = 0; i < maxRepeaters.length; i++) {
                        const tempOffset = offset + str[i].length - text.length;
                        const ifirst = str[i].substring(0, variable.start + tempOffset);
                        const isecond = str[i].substring(variable.start + variable.length + tempOffset);

                        str[i] = `${ifirst}${newVar}${isecond}`;
                    }
                } else {
                    text = `${first}${newVar}${second}`;

                    offset += newVar.length - variable.length;

                    str = [text];
                }
            } else {
                if (repeatEachLine) {
                    for (let i = 0; i < maxRepeaters.length; i++) {
                        const tempOffset = offset + str[i].length - text.length;
                        const ifirst = str[i].substring(0, variable.start + tempOffset);
                        const isecond = str[i].substring(variable.start + variable.length + tempOffset);

                        str[i] = `${ifirst}${newVar[i]}${isecond}`;
                    }
                } else {
                    for (let i = 0; i < maxRepeaters.length; i++) {
                        let varValue: string;

                        if (newVar.length === maxRepeaters.length) {
                            varValue = newVar[i];
                        } else {
                            varValue = newVar[0];
                        }

                        text = `${first}${varValue}${second}`;

                        offset = newVar[0].length - variable.length;
                    }
                }
            }
        });

        return str.join("\n");
    }

    protected getTypeText(variable: ISyntaxType): string {
        const variableString = variable.text.slice(2, -1);

        return variableString;
    }

    private getCurrentLine(syntaxText: string, index: number): string {
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

    private typeInLine(text: string) {
        for (const key in this.vars) {
            if (text.includes(`\${${key}}`) && !(text.includes(`\\\${${key}}`))) {
                return true;
            }
        }

        return false;
    }

    private maxNumOfType(vars: any[]): any {
        let maxRepeaters = 0;

        vars.forEach((locals) => {
            const variable = this.vars[locals.text.slice(2, -1)];
            if (typeof variable !== "string") {

                if (variable.length > maxRepeaters) {
                    maxRepeaters = variable;
                }
            }
        });

        return maxRepeaters;
    }

    private getLocalTypes(text: string, variables: ISyntaxType[], index: number): any[] {
        const includedVars = [];

        for (const variable of variables) {
            if (variable.start >= index && variable.start + variable.length <= index + text.length) {
                if (variable.text.slice(2, -1) in this.vars) {
                    includedVars.push(variable);
                }
            }
        }

        return includedVars;
    }

    private getArrayVars(variables: ISyntaxType[]): any[] {
        const varNames = [];

        for (const varObj of variables) {
            const variable = this.vars[varObj.text.slice(2, -1)];

            if (typeof variable !== "string") {
                varNames.push(varObj);
            }
        }

        return varNames;
    }
}
