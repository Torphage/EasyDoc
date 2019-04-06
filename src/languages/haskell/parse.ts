/**
 * A parser for Haskell.
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
     * @param {string} docType
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
