/**
 * A parser for Typescript.
 */

/**
 * EasyDoc.
 */
import { IParams } from "../../interfaces";
import { copy, removeStringBetweenChar } from "../../utils";
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
     * @param {string} docType
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

        let tempStr: string = copy(newlineRows.join("\n"));
        for (const temp of this.allRegex.syntax.string) {
            const char = temp.value;
            tempStr = removeStringBetweenChar(tempStr, char);
        }

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

        const paramsObj = params.split(",");

        const paramList = paramsObj.map((param) => param.split(":")[0].trim());
        const paramTypes = paramsObj.map((param) => param.split(":")[1] !== "any" ? param.split(":")[1].trim() : "*");

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
        let tempStr: string = copy(this.documentText);
        for (const temp of this.allRegex.syntax.string) {
            const char = temp.value;
            tempStr = removeStringBetweenChar(tempStr, char);
        }

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
        const regex = /\s*(?<export>export)?\s*(?<abstract>abstract)?\s*(?<default>private|protected|public)?\s*(?<const>class|function|module)?\s+(?<name>\w+)\s*/g;
        const parentLine = returningString[returningString.length - blockIndex];
        const parent = regex.exec(parentLine);

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
