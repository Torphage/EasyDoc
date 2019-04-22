/**
 * Where parsing of a language is implemented.
 */

/**
 * EasyDoc.
 */
import regexExpressions from "../config/languages";
import { ILanguage, IParams } from "../interfaces";
import { copy, removeStringBetweenChar } from "../utils";

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
        const match = this.regex.exec(rows.join("\n"));

        return match.groups;
    }

    /**
     * Escape every character in a string by returning a copy of the input string with the strings replaced with
     * only hashes.
     *
     * @protected
     * @param {string[]} newlineRows The input text to replace every string in.
     * @returns {string} Return a copy of the input string with every character inside the strings with hashes.
     * @memberof BaseParse
     */
    protected escapeStrings(newlineRows: string[]): string {
        let tempStr: string = copy(newlineRows.join("\n"));

        for (const temp of this.allRegex.syntax.string) {
            const char = temp.value;
            tempStr = removeStringBetweenChar(tempStr, char);
        }
        return tempStr;
    }

    /**
     * Escape every character in a string by returning a copy of the input string with the comments replaced with
     * only hashes.
     *
     * @protected
     * @param {string[]} newlineRows The input text to replace every comment in.
     * @returns {string} Return a copy of the input string with every character inside the comments with hashes.
     * @memberof BaseParse
     */
    protected escapeComments(newlineRows: string[]): string {
        let tempStr: string = copy(newlineRows.join("\n"));

        const comments = this.allRegex.syntax.comment;

        const singleLineRegex = new RegExp(`${comments.COMMENT}.*$`, "gm");
        tempStr = tempStr.replace(
            singleLineRegex,
            (a, b, c) => "#".repeat(
                c.slice(b).split("\n")[0].slice(0, a.length).length,
            ),
        );

        const start = comments.BLOCK_COMMENT_START.replace(
            /[(){}/\\]/,
            (match) => {
                return `\\${match}`;
            },
        );
        const end = comments.BLOCK_COMMENT_START.replace(
            /[(){}/\\]/,
            (match) => {
                return `\\${match}`;
            },
        );

        const multiLineRegex = new RegExp(`${start}.*${end}`, "gm");
        tempStr = tempStr.replace(
            multiLineRegex,
            (a) => "#".repeat(
                a.slice(0, a.length - a.split("\n").length + 1).length) + "\n".repeat(a.split("\n").length - 1),
        );

        return tempStr;
    }
}
