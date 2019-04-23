/**
 * A parser for Ruby.
 */

/**
 * EasyDoc.
 */
import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

/**
 * A parser for Ruby.
 *
 * @export
 * @class RubyParse
 * @extends {BaseParse}
 */
export class RubyParse extends BaseParse {

    /**
     * The block starts that ruby supports.
     *
     * @private
     * @type {string[]}
     * @memberof RubyParse
     */
    private blockStarts: string[];

    /**
     * Creates an instance of RubyParse.
     *
     * @param {string} documentText The text of the document.
     * @param {string} docType The type of documentation to make.
     * @memberof RubyParse
     */
    constructor(documentText: string, docType: string) {
        super(documentText, docType);
        this.blockStarts = [
            "begin",
            "def",
            "if",
            "case",
            "unless",
            "do",
            "class",
            "module",
        ];
    }

    /**
     * The parsed block of what to document.
     *
     * @param {string[]} rows The rows to get the block from.
     * @returns {string[]} The rows of the block.
     * @memberof RubyParse
     */
    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);

        let tempStr = this.escapeStrings(newlineRows);
        tempStr = this.escapeComments(tempStr.split("\n"));

        const tmp = tempStr.split("\n");

        let blockDepth = 0;
        let blockIndex = 0;

        for (const line of tmp) {
            const matchEnd = new RegExp("^\\s*end").test(line);

            if (matchEnd) {
                blockDepth--;
            }

            for (const blockStart of this.blockStarts) {
                let matchBlockStart: boolean;
                if (blockStart !== "do") {
                    matchBlockStart = new RegExp("^\\s*" + blockStart + "\\s").test(line);
                } else {
                    matchBlockStart = /\sdo\s(?:\|\w*\||\s)/g.test(line);
                }

                if (matchBlockStart) {
                    blockDepth++;
                    break;
                }
            }

            blockIndex++;

            if (blockDepth <= 0) {
                break;
            }
        }

        return lines.slice(0, blockIndex);
    }

    /**
     * The parsed params.
     *
     * @param {string} params The params to parse.
     * @returns {IParams} The parsed params.
     * @memberof RubyParse
     */
    public parseParams(params: string): IParams {
        if (params === undefined) {
            return {
                paramList: undefined,
                template: undefined,
            };
        }

        const paramList = params.replace(/[^,\w:]+/g, "").split(",");

        const templateList = paramList.map((param) => `$[${param}]`);
        const template = templateList.join(", ");

        if (paramList.length === 1 && paramList[0].length === 0) {
            return {
                paramList: undefined,
                template: undefined,
            };
        }

        return {
            paramList,
            template,
        };
    }

    /**
     * The parsed information gathered from the parent node.
     *
     * @param {number} childIndex The function's start index.
     * @returns {{ [key: string]: string }} A regular expression group consisting of
     * the name of the parent and what constructor it is.
     * @memberof RubyParse
     */
    public parseParent(childIndex: number): { [key: string]: string } {
        const newlineRows = this.documentText.split("\n");

        let tempStr = this.escapeStrings(newlineRows);
        tempStr = this.escapeComments(tempStr.split("\n"));

        const tmp = tempStr.split("\n");

        let blockDepth = 0;
        let blockIndex = 0;

        const returningString = tmp.slice(0, childIndex);

        for (const line of returningString.slice().reverse()) {
            const matchEnd = new RegExp("^\\s*end").test(line);
            if (matchEnd) {
                blockDepth++;
            }

            for (const blockStart of this.blockStarts) {
                let matchBlockStart: boolean;
                if (blockStart !== "do") {
                    matchBlockStart = new RegExp("^\\s*" + blockStart + "\\s").test(line);
                } else {
                    matchBlockStart = /\sdo\s(?:\|\w*\||\s)/g.test(line);
                }

                if (matchBlockStart) {
                    blockDepth--;
                    break;
                }
            }

            blockIndex++;

            if (blockDepth < 0) {
                break;
            }
        }

        const parentLine = returningString[returningString.length - blockIndex];
        this.regex.lastIndex = 0;
        const parent = this.regex.exec(parentLine);

        // tslint:disable-next-line:max-line-length
        return parent !== null ? parent.groups : {export: undefined, abstract: undefined, default: undefined, cosnt: undefined, name: undefined};
    }

    /**
     * Split the lines to what the language actually represents.
     *
     * @private
     * @param {string[]} rows The rows to split.
     * @returns {string[]} The real representation of the rows.
     * @memberof RubyParse
     */
    private splitLines(rows: string[]): string[] {
        let escapeNewLine = false;

        const outStr: string[] = [];

        for (const line of rows) {
            const newSplit = line.split(";");

            for (const index in newSplit) {
                if (outStr.length >= 1) {
                    if (escapeNewLine) {
                        const i = outStr.length - 1;
                        outStr[i] = outStr[i].concat(newSplit[index].trim());

                        escapeNewLine = false;
                    } else {
                        outStr.push(newSplit[index]);

                        if (newSplit[index].trim().endsWith("\\")) {
                            escapeNewLine = true;
                        }
                    }
                } else {
                    outStr.push(newSplit[index]);
                }
            }
        }

        return outStr;
    }
}
