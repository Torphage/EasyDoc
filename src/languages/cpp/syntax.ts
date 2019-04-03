/**
 * Implementation of Cpp.
 */
import { ISyntaxVariable } from "../../interfaces";
import { WorkShop } from "../workshop";
import { CppParse } from "./parse";

/**
 * Cpp, extends WorkShop.
 *
 * @export
 * @class Cpp
 * @extends {WorkShop}
 */
export class Cpp extends WorkShop {
    protected parse: CppParse;

    /**
     * Creates an instance of Cpp.
     *
     * @param {string} syntaxFile
     * @param {string} docType
     * @memberof Cpp
     */
    constructor(syntaxFile: string, docType: string) {
        super(syntaxFile);
        this.parse = new CppParse(docType);
    }

    /**
     * Check if the cursor is correctly placed in the function.
     *
     * @protected
     * @param {string} functionLineIndex The row to search on.
     * @returns {boolean} If cursor is correctly placed.
     * @memberof WorkShop
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
     * @returns {Promise<ISyntaxVariable>} An promise to return the variables.
     * @memberof WorkShop
     */
    protected getVariables(): Promise<ISyntaxVariable> {
        const parse = this.parse.parse(this.block);
        const params = this.parse.parseParams(parse.params);

        const variables: ISyntaxVariable =  {
            NAME: parse.name,
            PARAMS: params.paramList,
            PARAMS_TYPES: params.paramTypes,
            PARAMS_TEMPLATE: params.template,
            BLOCK_COMMENT_START: this.getComment("BLOCK_COMMENT_START"),
            BLOCK_COMMENT_END: this.getComment("BLOCK_COMMENT_END"),
            COMMENT: this.getComment("COMMENT"),
        };

        return new Promise((resolve, reject) => {
            resolve(variables);
            reject(undefined);
        });
    }

    /**
     * Get the current column in the editor
     *
     * @protected
     * @param {number} index The line index.
     * @returns {number} The column the user is positioned at.
     * @memberof WorkShop
     */
    protected getCurrentColumn(index: number): number {
        const leftOfCurrentPos = this.syntaxFile.slice(0, index);
        const leftIndex = leftOfCurrentPos.lastIndexOf("\n");
        const currentColumn = leftOfCurrentPos.length - leftIndex;
        return currentColumn;
    }
}
