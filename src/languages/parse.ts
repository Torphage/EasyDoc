/**
 * Where parsing of a language is implemented.
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
    public blockStartIndex: number = 0;
    protected documentText: string;
    protected allRegex: ILanguage;
    protected regex: RegExp;

    /**
     * Creates an instance of BaseParse.
     *
     * @param {string} docType The type of document to parse.
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
