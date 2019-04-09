/**
 * A parser for Javascript.
 */

/**
 * EasyDoc.
 */
import { IParams } from "../../interfaces";
import { copy, removeStringBetweenChar } from "../../utils";
import { BaseParse } from "../parse";

/**
 * A parser for Javascript.
 *
 * @export
 * @class JavascriptParse
 * @extends {BaseParse}
 */
export class JavascriptParse extends BaseParse {

    /**
     * Creates an instance of JavascriptParse.
     *
     * @param {string} documentText The text of the document.
     * @param {string} docType The type of documentation to make.
     * @memberof JavascriptParse
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
     * @memberof JavascriptParse
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
     * @memberof BaseParse
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
