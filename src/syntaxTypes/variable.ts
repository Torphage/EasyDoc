import { ISyntaxType, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";
import { VariableTranslator } from "./translate";

export class Variable {
    private vars: ISyntaxVariable;
    private text: string;

    private customTypes = new CustomSyntax();
    private index = 0;

    constructor(vars: ISyntaxVariable) {
        this.vars = vars;
    }

    public generate(text: string): string {
        this.text = text;

        const snippet = [];
        const textLines = this.text.split("\n");

        for (this.index = 0; this.index < textLines.length; this.index++) {

            const currentLine = textLines[this.index];

            if (this.index !== 0) {
                snippet.push("\n");
            }

            if (this.typeInLine(currentLine)) {
                const snippetStr = this.createType(currentLine);
                snippet.push(snippetStr);

                continue;
            }

            snippet.push(textLines[this.index]);
        }

        return snippet.join("");
    }

    private createType(text: string): string {
        const localVars = this.getLocalTypes(text);
        const maxRepeaters = this.maxNumOfType(localVars);

        let repeatEachLine: boolean;
        let str: string[] = [];
        let offset = 0;

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

    private getTypeValue(variable: ISyntaxType): any {
        const varName = this.getVarName(variable.text);
        const tempVar = this.vars[varName];

        if (tempVar === undefined) { return tempVar; }

        const translator = new VariableTranslator(
            variable.text.slice(2, -1), varName, tempVar);

        return translator.translate();
    }

    private typeInLine(text: string): boolean {
        const varMatch = this.customTypes.getSyntax(text, "variables");
        if (varMatch.length > 0) {
            return true;
        }

        return false;
    }

    private maxNumOfType(vars: any[]): any {
        let maxRepeaters = [];

        vars.forEach((locals) => {
            const variable = this.vars[this.getVarName(locals.text)];
            if (Array.isArray(variable)) {
                if (variable.length > maxRepeaters.length) {
                    maxRepeaters = variable;
                }
            }
        });

        return maxRepeaters;
    }

    private getLocalTypes(text: string): ISyntaxType[] {
        const variables = this.customTypes.getSyntax(text, "variables");

        const includedVars = [];
        for (const variable of variables) {
            if (this.getVarName(variable.text) in this.vars) {
                includedVars.push(variable);
            }
        }

        return includedVars;
    }

    private getArrayVars(variables: ISyntaxType[]): any[] {
        const varNames = [];

        for (const varObj of variables) {
            const variable = this.vars[this.getVarName(varObj.text)];

            if (Array.isArray(variable)) {
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
