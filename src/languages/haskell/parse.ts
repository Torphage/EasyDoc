/**
 * A parser for Haskell.
 */

/**
 * EasyDoc.
 */
import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

/**
 * A parser for Haskell.
 *
 * @export
 * @class HaskellParse
 * @extends {BaseParse}
 */
export class HaskellParse extends BaseParse {

    /**
     * Creates an instance of HaskellParse.
     *
     * @param {string} documentText The text of the document.
     * @param {string} docType The type of documentation to make.
     * @memberof HaskellParse
     */
    constructor(documentText: string, docType: string) {
        super(documentText, docType);
    }

    /**
     * The parsed block of what to document.
     *
     * @abstract
     * @param {string[]} rows The rows to get the block from.
     * @returns {string[]} The rows of the block.
     * @memberof HaskellParse
     */
    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);
        const functionRows: string[] = [lines[0]];
        const regex = /^(\s)*/g;

        const startIndentation = lines[0].match(regex);

        for (const line of lines.slice(1)) {
            const indentation = line.match(regex);
            if (line.length === 0) {
                continue;
            }

            if (indentation <= startIndentation) {
                break;
            }

            functionRows.push(line);
        }

        return functionRows;
    }

    /**
     * The parsed params.
     *
     * @abstract
     * @param {string} params The params to parse.
     * @returns {IParams} The parsed params.
     * @memberof HaskellParse
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
     * @memberof HaskellParse
     */
    public parseParent(childIndex: number): { [key: string]: string } {
        const newlineRows = this.documentText.split("\n");

        let tempStr = this.escapeStrings(newlineRows);
        tempStr = this.escapeComments(tempStr.split("\n"));

        const tmp = tempStr.split("\n");
        const returningString = tmp.slice(0, childIndex);

        const indentationRegex = /^(\s)*/g;
        const startIndentation = this.documentText[childIndex].match(indentationRegex);

        let blockIndex = 0;

        for (const line of returningString.slice().reverse()) {
            const indentation = line.match(indentationRegex);
            if (line.length === 0) {
                continue;
            }

            if (indentation < startIndentation) {
                break;
            }

            blockIndex++;
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
     * @memberof HaskellParse
     */
    private splitLines(rows: string[]): string[] {
        let escapeNewLine = false;

        const outStr: string[] = [];

        for (const line of rows) {
            if (outStr.length >= 1) {
                if (escapeNewLine) {
                    const i = outStr.length - 1;
                    outStr[i] = outStr[i].concat(line.trim());

                    escapeNewLine = false;
                } else {
                    outStr.push(line);

                    if (line.trim().endsWith("\\")) {
                        escapeNewLine = true;
                    }
                }
            } else {
                outStr.push(line);
            }
        }

        return outStr;
    }
}
