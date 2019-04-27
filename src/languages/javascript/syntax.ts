/**
 * Implementation of Javascript.
 */

/**
 * EasyDoc.
 */
import { ISyntaxVariable } from "../../interfaces";
import { WorkShop } from "../workshop";
import { JavascriptParse } from "./parse";

/**
 * Javascript, extends WorkShop.
 *
 * @export
 * @class Javascript
 * @extends {WorkShop}
 */
export class Javascript extends WorkShop {

    /**
     * The Javascript parser.
     *
     * @protected
     * @type {JavascriptParse}
     * @memberof Javascript
     */
    protected parse: JavascriptParse;

    /**
     * Creates an instance of Javascript.
     *
     * @param {string} syntaxFile The template file text.
     * @param {string} docType The type of documentation to make.
     * @memberof Javascript
     */
    constructor(syntaxFile: string, docType: string) {
        super(syntaxFile);
        this.parse = new JavascriptParse(this.docRows, docType);
    }

    /**
     * Check if the cursor is correctly placed in the function.
     *
     * @protected
     * @param {string} functionLineIndex The row to search on.
     * @returns {boolean} If cursor is correctly placed.
     * @memberof Javascript
     */
    protected correctlyPlacedFunction(functionLineIndex: string): boolean {
        const regex = /\w*\(|function \s*\(/g;

        if (regex.exec(functionLineIndex) !== null) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Get the variables based on the language.
     *
     * @protected
     * @param {number} index The start index of the function.
     * @returns {Promise<ISyntaxVariable>} An promise to return the variables.
     * @memberof Javascript
     */
    protected getVariables(index: number): Promise<ISyntaxVariable> {
        const parse = this.parse.parse(this.block);
        const params = this.parse.parseParams(parse.params);

        const variables: ISyntaxVariable =  {
            NAME: parse.name,
            PARAMS: params.paramList,
            PARAMS_TYPES: undefined,
            PARAMS_TEMPLATE: params.template,
            ABSTRACT: undefined,
            EXPORT: undefined,
            ACCESS: undefined,
            CONST: undefined,
            RELATION: undefined,
            RELATIONNAME: undefined,
            PARENT: undefined,
            PARENT_CONST: undefined,
            RETURN_TYPE: undefined,
            BLOCK_COMMENT_START: this.getComment("BLOCK_COMMENT_START"),
            BLOCK_COMMENT_END: this.getComment("BLOCK_COMMENT_END"),
            COMMENT: this.getComment("COMMENT"),
            BLOCK: undefined,
            ROUTE: undefined,
        };

        return new Promise((resolve, reject) => {
            resolve(variables);
            reject(undefined);
        });
    }
}
