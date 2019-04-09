/**
 * Where parsing of a language is implemented.
 */

/**
 * EasyDoc.
 */
import regexExpressions from "../config/languages";
import { ILanguage, IParams } from "../interfaces";

/**
 * The Class where the parsing of a language is implemented.
 *
 * @export
 * @abstract
 * @class BaseParse
 */
export abstract class BaseParse {

    /**
     * The index of when the contructor's block  start. This is used for when a cunstructor spans
     * multiple lines.
     *
     * @type {number}
     * @memberof BaseParse
     */
    public blockStartIndex: number = 0;

    /**
     * The document text.
     *
     * @protected
     * @type {string}
     * @memberof BaseParse
     */
    protected documentText: string;

    /**
     * The regular expressions and syntaxes for a language.
     *
     * @protected
     * @type {ILanguage}
     * @memberof BaseParse
     */
    protected allRegex: ILanguage;

    /**
     * The regular expression of what to match.
     *
     * @protected
     * @type {RegExp}
     * @memberof BaseParse
     */
    protected regex: RegExp;

    /**
     * Creates an instance of BaseParse.
     *
     * @param {string} documentText The text of the document.
     * @param {string} docType The type of documentation to make
     * @memberof BaseParse
     */
    constructor(documentText: string, docType: string) {
        this.documentText = documentText;
        this.allRegex = regexExpressions[this.constructor.name.slice(0, -5)];
        this.regex = this.allRegex.regex[docType];
    }

    /**
     * The parsed block of what to document.
     *
     * @abstract
     * @param {string[]} rows The rows to get the block from.
     * @returns {string[]} The rows of the block.
     * @memberof BaseParse
     */
    public abstract parseBlock(rows: string[]): string[];

    /**
     * The parsed params.
     *
     * @abstract
     * @param {string} params The params to parse.
     * @returns {IParams} The parsed params.
     * @memberof BaseParse
     */
    public abstract parseParams(params: string): IParams;

    /**
     * Parse the regex.
     *
     * @param {string[]} rows The rows to parse from.
     * @returns {{[key: string]: string}} The regex match groups.
     * @memberof BaseParse
     */
    public parse(rows: string[]): {[key: string]: string} {
        this.regex.lastIndex = 0;
        const match = this.regex.exec(rows[0]);

        return match.groups;
    }
}
