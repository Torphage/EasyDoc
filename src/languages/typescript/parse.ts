/**
 * A parser for Typescript.
 */

/**
 * EasyDoc.
 */
import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

/**
 * A parser for Typescript.
 *
 * @export
 * @class TypescriptParse
 * @extends {BaseParse}
 */
export class TypescriptParse extends BaseParse {

    /**
     * Creates an instance of TypescriptParse.
     *
     * @param {string} documentText The text of the document.
     * @param {string} docType The type of documentation to make.
     * @memberof TypescriptParse
     */
    constructor(documentText: string, docType: string) {
        super(documentText, docType);
    }

    /**
     * The parsed block of what to document.
     *
     * @param {string[]} rows The rows to get the block from.
     * @returns {string[]} The rows of the block.
     * @memberof TypescriptParse
     */
    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);

        let tempStr = this.escapeStrings(newlineRows);
        tempStr = this.escapeComments(tempStr.split("\n"));

        const tmpStr = tempStr.split("\n");

        let openingBracket = 0;
        let closingBracket = 0;
        let blockIndex = 0;

        for (const line of tmpStr) {
            openingBracket += (line.match(/{/g) || []).length;
            closingBracket += (line.match(/}/g) || []).length;

            blockIndex++;

            if (openingBracket === 0) {
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
     * @param {string} params The params to parse.
     * @returns {IParams} The parsed params.
     * @memberof TypescriptParse
     */
    public parseParams(params: string): IParams {
        if (params === undefined) {
            return {
                paramList: undefined,
                paramTypes: undefined,
                template: undefined,
            };
        }

        let paramsObj: string[] = [];
        if (((params.match(/{/g) || []).length === 0) && ((params.match(/}/g) || []).length === 0)) {
            paramsObj = params.split(",");
        } else {
            let openingBracket = 0;
            let closingBracket = 0;
            let temp = "";

            for (const char of params) {
                if (char === "{") {
                    openingBracket++;
                } else if (char === "}") {
                    closingBracket++;
                }

                if (openingBracket <= closingBracket) {
                    if (char !== ",") {
                        temp += char;
                    } else {
                        paramsObj.push(temp.trim());
                        temp = "";
                    }
                } else {
                    temp += char;
                }
            }

            paramsObj.push(temp.trim());
        }

        const paramList = paramsObj.map(
            (param) => param.split(":")[0].trim());
        const paramTypes = paramsObj.map((param) =>
            param.split(":").slice(1).join(":").trim() !== "any" ? param.split(":").slice(1).join(":").trim() : "*",
        );

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
     * @memberof TypescriptParse
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

        // tslint:disable-next-line:max-line-length
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
     * @memberof TypescriptParse
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
