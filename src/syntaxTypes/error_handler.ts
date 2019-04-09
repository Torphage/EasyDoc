/**
 * Handle the error handlers.
 */

/**
 * EasyDoc.
 */
import { ISyntaxType, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";

/**
 * Handle the error handlers.
 *
 * @export
 * @class ErrorHandler
 */
export class ErrorHandler {

    /**
     * The available variables, defined by the Syntax class.
     *
     * @private
     * @type {ISyntaxVariable}
     * @memberof ErrorHandler
     */
    private vars: ISyntaxVariable;

    /**
     * Creates an instance of ErrorHandler.
     *
     * @param {ISyntaxVariable} vars The available variables, defined by the Syntax class.
     * @memberof ErrorHandler
     */
    constructor(vars: ISyntaxVariable) {
        this.vars = vars;
    }

    /**
     * Search for errors and handles them.
     *
     * @param {string} text The text to search for error from.
     * @returns {string} The string after error have been handles.
     * @memberof ErrorHandler
     */
    public handle(text: string): string {
        let block: ISyntaxType;
        const customTypes = new CustomSyntax();

        do {
            block = customTypes.getSyntax(text, "errorhandlers")[0];
            if (block === undefined) { break; }

            const variables = customTypes.getSyntax(block.text, "variables");
            let generateBlock = true;

            const beforeBlock = text.substr(0, block.start);
            const actualBlock = block.text.slice(2, -2);
            const afterBlock = text.substr(block.start + block.length);

            for (const variable of variables) {
                const varName = this.getVarName(variable.text);
                if (this.vars[varName] !== undefined) { continue; }

                if (Object.keys(this.vars).includes(varName)) {
                    generateBlock = false;
                    break;
                }
            }

            if (generateBlock) {
                text = `${beforeBlock}${actualBlock}${afterBlock}`;
            } else {
                text = `${beforeBlock}${afterBlock}`;
            }
        } while (true);

        return text;
    }

    /**
     * Get the variable name from the variable found within the template file.
     *
     * @private
     * @param {string} variable The variable as it was found within the template file.
     * @returns {string} The variables name.
     * @memberof ErrorHandler
     */
    private getVarName(variable: string): string {
        const splitted = variable.slice(2, -1).split(".")[0].split("(");

        return splitted[splitted.length - 1].split(")")[0].replace(/\)/, "");
    }
}
