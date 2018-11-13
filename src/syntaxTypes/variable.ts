import { CustomSyntax } from "../syntax";
import { ISyntaxType, ISyntaxVariable } from "../types";
import { VariableTranslator } from "./translate";

export class Variable {
    private customTypes: CustomSyntax;
    private vars: ISyntaxVariable;

    constructor(vars: ISyntaxVariable) {
        this.customTypes = new CustomSyntax();
        this.vars = vars;
    }

    public generate(text: string): string {
        const snippet = [];

        const variables = this.customTypes.getSyntax(text, "variables");

        for (let i = 0; i < text.length; i++) {

            if (this.isNewLine(text, i)) {
                const currentLine = this.getCurrentLine(text, i);

                if (this.typeInLine(currentLine)) {
                    const snippetStr = this.createType(variables, i, currentLine);

                    snippet.push(snippetStr);

                    i += currentLine.length;

                    continue;
                }
            }

            snippet.push(text[i]);
        }

        return snippet.join("");
    }

    private createType(variables: ISyntaxType[], index: number, text: string): string {
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
            const newVar = this.getTypeValue(variable);

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

    private isNewLine(text: string, index: number) {
        if (text[index - 1] === ("\n" || undefined)) {
            return true;
        }

        return false;
    }

    private getTypeValue(variable: ISyntaxType): any {
        const varName = this.getVarName(variable.text);
        const tempVar = this.vars[varName];

        const translator = new VariableTranslator(
            variable.text.slice(2, -1), varName, tempVar);

        return translator.translate();
    }

    private getCurrentLine(syntaxText: string, index: number): string {
        const leftOfCurrentPos = syntaxText.slice(0, index);
        const rightOfCurrentPos = syntaxText.slice(index);

        const rightIndex = rightOfCurrentPos.indexOf("\n");

        let fullLine: string;

        if (rightIndex !== -1) {
            fullLine = rightOfCurrentPos.substring(0, rightIndex);
        } else {
            fullLine = syntaxText.substring(leftOfCurrentPos.length + 2);
        }

        return fullLine;
    }

    private typeInLine(text: string) {
        const varMatch = this.customTypes.getSyntax(text, "variables");
        if (varMatch.length > 0) {
            return true;
        }

        return false;
    }

    private maxNumOfType(vars: any[]): any {
        let maxRepeaters = 0;

        vars.forEach((locals) => {
            const variable = this.vars[this.getVarName(locals.text)];
            if (typeof variable !== "string") {

                if (variable.length > maxRepeaters) {
                    maxRepeaters = variable;
                }
            }
        });

        return maxRepeaters;
    }

    private getLocalTypes(text: string, variables: ISyntaxType[], index: number): ISyntaxType[] {
        const includedVars = [];

        for (const variable of variables) {
            if (variable.start >= index && variable.start + variable.length <= index + text.length) {
                if (this.getVarName(variable.text) in this.vars) {
                    includedVars.push(variable);
                }
            }
        }

        return includedVars;
    }

    private getArrayVars(variables: ISyntaxType[]): any[] {
        const varNames = [];

        for (const varObj of variables) {
            const variable = this.vars[this.getVarName(varObj.text)];

            if (typeof variable !== "string") {
                varNames.push(varObj);
            }
        }

        return varNames;
    }

    private getVarName(variable: string): string {
        const splitted = variable.slice(2, -1).split(".")[0].split("(");

        return splitted[splitted.length - 1].split(")")[0].replace(/\)/, "");
    }
}
