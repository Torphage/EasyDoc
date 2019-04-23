/**
 * A parser for Cpp.
 */

/**
 * EasyDoc.
 */
import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

/**
 * A parser for Cpp.
 *
 * @export
 * @class CppParse
 * @extends {BaseParse}
 */
export class CppParse extends BaseParse {

    /**
     * Creates an instance of CppParse.
     *
     * @param {string} documentText The text of the document.
     * @param {string} docType The type of documentation to make.
     * @memberof CppParse
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
     * @memberof CppParse
     */
    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);

        let tempStr = this.escapeStrings(newlineRows);
        tempStr = this.escapeComments(tempStr.split("\n"));

        const tmpStr = tempStr.split("\n");

        let openingBracket = 0;
        let closingBracket = 0;
        let blockStarted = false;
        let blockIndex = 0;

        for (const line of tmpStr) {
            if (line.includes("{")) {
                blockStarted = true;
                openingBracket++;
            }

            if (line.includes("}")) {
                closingBracket++;
            }

            blockIndex++;

            if (!blockStarted) {
                this.blockStartIndex++;
                continue;
            }

            if (openingBracket <= closingBracket) {
                break;
            }
        }

        return lines.slice(0, blockIndex);
    }

    /**
     * The parsed params.
     *
     * @abstract
     * @param {string} params The params to parse.
     * @returns {IParams} The parsed params.
     * @memberof CppParse
     */
    public parseParams(params: string): IParams {
        if (params === undefined) {
            return {
                paramList: undefined,
                paramTypes: undefined,
                template: undefined,
            };
        }

        const paramsObj = params.split(",").map((param) => param.trim());

        const paramList = paramsObj.map(
            (param) => param.split(" ")[param.split(" ").length - 1]);
        const paramTypes = paramsObj.map(
            (param) => param.replace(` ${param.split(" ")[param.split(" ").length - 1]}`, ""));

        const templateList = paramList.map((param) => `$[${param}]`);
        const template = templateList.join(", ");

        if (paramList.length === 1 && paramList[0].length === 0) {
            return {
                paramList: undefined,
                paramTypes: undefined,
                template: undefined,
            };
        }

        return {
            paramList,
            paramTypes,
            template,
        };
    }

    /**
     * The parsed information gathered from the parent node.
     *
     * @param {number} childIndex The function's start index.
     * @returns {{ [key: string]: string }} A regular expression group consisting of
     * the name of the parent and what constructor it is.
     * @memberof CppParse
     */
    public parseParent(childIndex: number): { [key: string]: string } {
        const newlineRows = this.documentText.split("\n");

        let tempStr = this.escapeStrings(newlineRows);
        tempStr = this.escapeComments(tempStr.split("\n"));

        const tmp = tempStr.split("\n");

        const returningString = tmp.slice(0, childIndex);

        let openingBracket = 0;
        let closingBracket = 0;
        let blockIndex = 0;

        for (const line of returningString.slice().reverse()) {
            openingBracket += (line.match(/{/g) || []).length;
            closingBracket += (line.match(/}/g) || []).length;

            blockIndex++;

            if (openingBracket === 0) {
                this.blockStartIndex++;
                continue;
            }

            if (openingBracket > closingBracket) {
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
     * @memberof CppParse
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
