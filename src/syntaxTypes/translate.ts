/**
 * Translates variables.
 */

/**
 * EasyDoc.
 */
import { copy } from "../utils";

/**
 * Translator for the Variable class.
 *
 * @export
 * @class VariableTranslator
 */
export class VariableTranslator {

    /**
     * The name of the variable.
     *
     * @private
     * @type {string}
     * @memberof VariableTranslator
     */
    private varName: string;

    /**
     * The value of the variable as seen in the template file.
     *
     * @private
     * @type {string}
     * @memberof VariableTranslator
     */
    private varValue: string;

    /**
     * Creates an instance of VariableTranslator.
     *
     * @param {string} varName The variable name.
     * @param {*} varValue The variable value.
     * @memberof VariableTranslator
     */
    constructor(varName: string, varValue: any) {
        this.varName = varName;
        this.varValue = varValue;
    }

    /**
     * Translate a variable.
     *
     * @param {string} text The text to translate.
     * @returns {*} The value of the translated variable.
     * @memberof VariableTranslator
     */
    public translate(text: string): any {
        let advancedSyntax: RegExpMatchArray;
        let varName = copy(this.varValue);

        const cleanText = text.replace(/(\s)/g, "");
        let tempText: string = copy(cleanText);

        do {
            advancedSyntax = this.isAdvancedSyntax(tempText);

            if (advancedSyntax === null) {
                break;
            }

            const splitted = tempText.split(this.varName);

            if (splitted[1][0] === ".") {
                const regex = /^\.\w*/g;
                const property = splitted[1].match(regex)[0].slice(1);

                varName = this.handleProperty(property, varName);

                tempText = tempText.replace(`${this.varName}.${property}`, this.varName);
            }
            if (splitted[1][0] === ")") {
                const func = cleanText.substring(
                    splitted[0].slice(0, -1).lastIndexOf("(") + 1, splitted[1].indexOf(")") + splitted[0].length - 1);

                varName = this.handleFunction(func, varName);

                tempText = tempText.replace(`${func}(${this.varName})`, this.varName);
            }
        } while (advancedSyntax);

        return varName;
    }

    /**
     * Check if text has an advanced syntax. If it includes any functions or properties.
     *
     * @private
     * @param {string} text The text to match.
     * @returns {RegExpMatchArray} The match. If the match is not empty it will be used as true.
     * @memberof VariableTranslator
     */
    private isAdvancedSyntax(text: string): RegExpMatchArray {
        const regex = /([.()])/g;
        const result = text.match(regex);

        return result;
    }

    /**
     * Applies the function to the value..
     *
     * @private
     * @param {string} func The function to apply.
     * @param {*} value The value to apply to.
     * @returns {*} The value with the applied function.
     * @memberof VariableTranslator
     */
    private handleFunction(func: string, value: any): any {
        let returnValue: any = value;

        if (value.constructor === Array) {
            switch (func) {
                case "reverse":
                    returnValue = value.reverse();
                    break;

                case "align":
                    const maxValue = Math.max(...(value.map((el) => el.length)));
                    const temp = [...value].map((n) => maxValue - n.length);
                    returnValue = [];
                    temp.forEach((n) => {
                        returnValue.push(" ".repeat(n));
                    });
                    break;
            }
        } else {
            switch (func) {
                case "reverse":
                    returnValue = value.split("").reverse().join("");
                    break;
            }
        }

        return returnValue;
    }

    /**
     * Applies the property to the value..
     *
     * @private
     * @param {string} pro The property to apply.
     * @param {*} value The value to apply to.
     * @returns {*} The value with the applied property.
     * @memberof VariableTranslator
     */
    private handleProperty(prop: string, value: any): any {
        let returnValue: any;

        if (value.constructor === Array) {
            switch (prop) {
                case "length":
                    returnValue = value.length;
                    break;

                case "each_length":
                    returnValue = [...value].map((n) => n.length);
                    break;
            }
        } else {
            switch (prop) {
                case "length":
                    returnValue = String(value.length);
                    break;
            }
        }

        return returnValue;
    }
}
