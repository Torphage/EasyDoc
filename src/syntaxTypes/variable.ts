import * as vs from "vscode";
import { ISyntaxType, ISyntaxVariable } from "../types";
import * as utils from "../utils";
import { BaseSyntaxType } from "./base_type";

export class Variable extends BaseSyntaxType {
    constructor(vars: ISyntaxVariable) {
        super(vars);
    }

    public applyType(text: string): string {
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

    protected getType(variables: ISyntaxType[], index: number): ISyntaxType {
        for (const variable of variables) {
            if (variable.start === index) {
                if (this.getVarName(variable.text.slice(2, -1)) in this.vars) {
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
            const varName = this.getVarName(variable.text.slice(2, -1));
            const tempVar = this.vars[varName];
            const newVar = this.getTypeValue(tempVar, variable.text.slice(2, -1));

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

    protected getTypeValue(varValue: any, text: string): any {
        let varName = utils.copy(varValue);

        const splitted = text.split("(");
        const functions = splitted.pop().split(".").slice(1);

        if (varValue.constructor === Array) {
            for (const func of splitted) {
                switch (func) {
                    case "reverse":
                        varName = varName.reverse();
                        break;

                    case "align":
                        let temp: any[];
                        const maxValue = Math.max(...(varName.map((el) => el.length)));
                        temp = [...varName].map((n) => maxValue - n.length);
                        varName = [];
                        temp.forEach((n) => {
                            varName.push(" ".repeat(n));
                        });
                        break;
                }
            }
            for (const dot of functions) {
                switch (dot) {
                    case "length":
                        varName = [...Array(varName.length)].map((i) => varName.length);
                        break;

                    case "each_length":
                        varName = [...varName].map((n) => n.length);
                        break;
                }
            }
        } else {
            for (const func of splitted) {
                switch (func) {
                    case "reverse":
                        varName = varName.split("").reverse().join("");
                        break;
                }
            }

            for (const dot of functions) {
                switch (dot) {
                    case "length":
                        varName = String(varName.length);
                        break;
                }
            }
        }
        return varName;
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
            const variable = this.vars[this.getVarName(locals.text.slice(2, -1))];
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
                if (this.getVarName(variable.text.slice(2, -1)) in this.vars) {
                    includedVars.push(variable);
                }
            }
        }

        return includedVars;
    }

    private getArrayVars(variables: ISyntaxType[]): any[] {
        const varNames = [];

        for (const varObj of variables) {
            const variable = this.vars[this.getVarName(varObj.text.slice(2, -1))];

            if (typeof variable !== "string") {
                varNames.push(varObj);
            }
        }

        return varNames;
    }

    private getVarName(variable: string): string {
        const splitted = variable.split(".")[0].split("(");

        if (splitted.length > 1) {
            return splitted[splitted.length - 1].replace(/\)/, "");
        } else {
            return splitted[0].replace(/\)/, "");
        }
    }
}
