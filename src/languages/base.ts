/**
 * The base implementation of WorkShop.
 */

/**
 * EasyDoc.
 */
import { ISyntaxVariable } from "../interfaces";
import { WorkShop } from "./workshop";

/**
 * The base implementation of WorkShop.
 *
 * @export
 * @class Base
 * @extends {WorkShop}
 */
export class Base extends WorkShop {

    /**
     * Creates an instance of Base.
     *
     * @param {string} syntaxFile The template file text.
     * @memberof Base
     */
    constructor(syntaxFile: string) {
        super(syntaxFile);
    }

    /**
     * Check if the cursor is correctly placed in the function.
     *
     * @protected
     * @abstract
     * @param {string} row The row to search on.
     * @returns {boolean} If cursor is correctly placed.
     * @memberof WorkShop
     */
    public correctlyPlacedFunction(functionLineIndex: string): boolean { return; }

    /**
     * Get the current column in the editor
     *
     * @protected
     * @abstract
     * @param {number} index The line index.
     * @returns {number} The column the user is positioned at.
     * @memberof WorkShop
     */
    public getCurrentColumn(index: number): number { return; }

    /**
     * Get the variables based on the language.
     *
     * @protected
     * @abstract
     * @returns {Promise<ISyntaxVariable>} An promise to return the variables.
     * @memberof WorkShop
     */
    public getVariables(): Promise<ISyntaxVariable> {
        const variables: ISyntaxVariable = {
            BLOCK_COMMENT_START: this.getComment("BLOCK_COMMENT_START"),
            BLOCK_COMMENT_END: this.getComment("BLOCK_COMMENT_END"),
            COMMENT: this.getComment("COMMENT"),
        };

        return new Promise((resolve, reject) => {
            resolve(variables);
            reject(undefined);
        });
    }
}
