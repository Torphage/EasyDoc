/**
 * Implementation of Typescript.
 */

/**
 * EasyDoc.
 */
import { ISyntaxVariable } from "../../interfaces";
import { WorkShop } from "../workshop";
import { TypescriptParse } from "./parse";

/**
 * Typescript, extends WorkShop
 *
 * @export
 * @class Typescript
 * @extends {WorkShop}
 */
export class Typescript extends WorkShop {

    /**
     * The Typescript parser.
     *
     * @protected
     * @type {TypescriptParse}
     * @memberof Typescript
     */
    protected parse: TypescriptParse;

    /**
     * Creates an instance of Typescript.
     *
     * @param {string} syntaxFile The template file text.
     * @param {string} docType The type of documentation to make.
     * @memberof Typescript
     */
    constructor(syntaxFile: string, docType: string) {
        super(syntaxFile);
        this.parse = new TypescriptParse(this.docRows, docType);
    }

    /**
     * Check if the cursor is correctly placed in the function.
     *
     * @protected
     * @param {string} functionLineIndex The row to search on.
     * @returns {boolean} If cursor is correctly placed.
     * @memberof Typescript
     */
    protected correctlyPlacedFunction(functionLine: string): boolean {
        // tslint:disable-next-line:max-line-length
        const regex = /\s*(?<export>export)?\s*(?<abstract>abstract)?\s*(?<default>private|protected|public)?\s*(?<const>class|function|module)?\s+(?<name>\w+)\s*(?:(?<relation>extends|implements)?\s+(?<relationName>\w*)?|(?:\s*\((?<params>[^)]*)\)\:\s*(?<returnType>(?:\{(?:[^}{]+|\{(?:[^}{]+|\{[^}{]*\})*\})*\})|[^\}]*)))?\s*?/g;
        // return true;

        if (regex.exec(functionLine) !== null) {
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
     * @memberof Typescript
     */
    protected getVariables(index: number): Promise<ISyntaxVariable> {
        const parse = this.parse.parse(this.block);
        const params = this.parse.parseParams(parse.params);
        const parent = this.parse.parseParent(index);

        const variables: ISyntaxVariable =  {
            NAME: parse.name,
            PARAMS: params.paramList,
            PARAMS_TYPES: params.paramTypes,
            PARAMS_TEMPLATE: params.template,
            ABSTRACT: parse.abstract,
            EXPORT: parse.export,
            ACCESS: parse.default !== "public" ? parse.default : undefined,
            CONST: parse.const !== "function" ? parse.const : undefined,
            RELATION: parse.relation,
            RELATIONNAME: parse.relationName,
            PARENT: parent.name,
            PARENT_CONST: parent.const !== "function" ? parent.const : undefined,
            // tslint:disable-next-line:max-line-length
            RETURN_TYPE: parse.returnType !== undefined ? parse.returnType.trim() !== "void" ? parse.returnType.trim() : undefined : undefined,
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
