/**
 * Translates variables.
 */
import { copy } from "../utils";

/**
 * Translator for the Variable class.
 *
 * @export
 * @class VariableTranslator
 */
export class VariableTranslator {
    private text: string;
    private varName: string;
    private varValue: string;

    /**
     * Creates an instance of VariableTranslator.
     *
     * @param {string} text The text to translate.
     * @param {string} varName The variable name.
     * @param {*} varValue The variable value.
     * @memberof VariableTranslator
     */
    constructor(text: string, varName: string, varValue: any) {
        this.text = text.replace(/(\s)/g, "");
        this.varName = varName;
        this.varValue = varValue;
    }

    /**
     * Translate a variable.
     *
     * @returns {*} The value of the translated variable.
     * @memberof VariableTranslator
     */
    public translate(): any {
        let advancedSyntax: RegExpMatchArray;
        let varName = copy(this.varValue);
        let text: string = copy(this.text);

        do {
            advancedSyntax = this.isAdvancedSyntax(text);

            if (advancedSyntax === null) {
                break;
            }

            const splitted = text.split(this.varName);

            if (splitted[1][0] === ".") {
                const regex = /^\.\w*/g;
                const property = splitted[1].match(regex)[0].slice(1);

                varName = this.handleProperty(property, varName);

                text = text.replace(`${this.varName}.${property}`, this.varName);
            }
            if (splitted[1][0] === ")") {
                const func = this.text.substring(
                    splitted[0].slice(0, -1).lastIndexOf("(") + 1, splitted[1].indexOf(")") + splitted[0].length - 1);

                varName = this.handleFunction(func, varName);

                text = text.replace(`${func}(${this.varName})`, this.varName);
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
