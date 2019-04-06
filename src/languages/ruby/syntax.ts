/**
 * Implementation of Ruby.
 */
import { ISyntaxVariable } from "../../interfaces";
import { WorkShop } from "../workshop";
import { RubyParse } from "./parse";

/**
 * Ruby, extends WorkShop
 *
 * @export
 * @class Ruby
 * @extends {WorkShop}
 */
export class Ruby extends WorkShop {
    protected parse: RubyParse;

    /**
     * Creates an instance of Ruby.
     *
     * @param {string} syntaxFile
     * @param {string} docType
     * @memberof Ruby
     */
    constructor(syntaxFile: string, docType: string) {
        super(syntaxFile);
        this.parse = new RubyParse(this.docRows, docType);
    }

    /**
     * Check if the cursor is correctly placed in the function.
     *
     * @protected
     * @param {string} functionLineIndex The row to search on.
     * @returns {boolean} If cursor is correctly placed.
     * @memberof Ruby
     */
    protected correctlyPlacedFunction(functionLineIndex: string): boolean {
        const regex = /^\s*(?:module|class|def)\s/g;

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
     * @memberof Ruby
     */
    protected getVariables(index: number): Promise<ISyntaxVariable> {
        const parse = this.parse.parse(this.block);
        const params = this.parse.parseParams(parse.params);
        const parent = this.parse.parseParent(index);

        const variables: ISyntaxVariable =  {
            NAME: parse.name,
            PARAMS: params.paramList,
            PARAMS_TYPES: undefined,
            PARAMS_TEMPLATE: params.template,
            ABSTRACT: undefined,
            EXPORT: undefined,
            ACCESS: undefined,
            CONST: parse.const,
            RELATION: parse.relation,
            RELATIONNAME: parse.relationName,
            PARENT: parent.name,
            PARENT_CONST: parent.const !== "function" ? parse.const : undefined,
            RETURN_TYPE: undefined,
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
