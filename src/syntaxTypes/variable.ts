/**
 * Handle everything about the variable type.
 */
import { ISyntaxType, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";
import { VariableTranslator } from "./translate";

/**
 * Handle variables, converts them to their correct values and so on.
 *
 * @export
 * @class Variable
 */
export class Variable {
    private vars: ISyntaxVariable;
    private text: string;

    private customTypes = new CustomSyntax();
    private index = 0;

    /**
     * Creates an instance of Variable.
     *
     * @param {ISyntaxVariable} vars The available variables, defined by the Syntax class.
     * @memberof Variable
     */
    constructor(vars: ISyntaxVariable) {
        this.vars = vars;
    }

    /**
     * Generate the variables, loops through the text by row and search for variables found withing.
     * Handles them if they are found.
     *
     * @param {string} text The text to search for variables from.
     * @returns {string} The text with converted variables.
     * @memberof Variable
     */
    public generate(text: string): string {
        this.text = text;

        const snippet = [];
        const textLines = this.text.split("\n");

        for (this.index = 0; this.index < textLines.length; this.index++) {

            const currentLine = textLines[this.index];
            const lineVars = this.getLocalTypes(currentLine);

            if (this.index !== 0) {
                snippet.push("\n");
            }

            if (lineVars.length > 0) {
                const snippetStr = this.createType(currentLine);
                snippet.push(snippetStr);

                continue;
            }

            snippet.push(textLines[this.index]);
        }

        return snippet.join("");
    }

    /**
     * Convert the text line with variables to a strin with the variables converted.
     *
     * @private
     * @param {string} text The text line to convert the variables within.
     * @returns {string} The string with the variables converted.
     * @memberof Variable
     */
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

    /**
     * Get the real value of the variable.
     *
     * @private
     * @param {ISyntaxType} variable The variable to get the converted value from.
     * @returns {*} The variable's converted value.
     * @memberof Variable
     */
    private getTypeValue(variable: ISyntaxType): any {
        const varName = this.getVarName(variable.text);
        const tempVar = this.vars[varName];

        if (tempVar === undefined) { return tempVar; }

        const translator = new VariableTranslator(
            variable.text.slice(2, -1), varName, tempVar);

        return translator.translate();
    }

    /**
     * Get the max length of variables that are an array.
     *
     * @private
     * @param {any[]} vars The vars to check on.
     * @returns {*} Return the variable's array length that has the most elements.
     * @memberof Variable
     */
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

    /**
     * Get the location of variables in a text.
     *
     * @private
     * @param {string} text The text to get variables from.
     * @returns {ISyntaxType[]} The list of variables with their location.
     * @memberof Variable
     */
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

    /**
     * Get the variables that are an array.
     *
     * @private
     * @param {ISyntaxType[]} variables The variables to search from.
     * @returns {any[]} The array varibles that has an value of an array.
     * @memberof Variable
     */
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

    /**
     * Get the variable name from the variable found within the template file.
     *
     * @private
     * @param {string} variable The variable as it was found within the template file.
     * @returns {string} The variables name.
     * @memberof Variable
     */
    private getVarName(variable: string): string {
        const splitted = variable.slice(2, -1).split(".")[0].split("(");

        return splitted[splitted.length - 1].split(")")[0].replace(/\)/, "");
    }
}
