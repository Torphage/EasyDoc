import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

export class JavascriptParse extends BaseParse {
    constructor() {
        super();
    }

    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);
        const functionRows: string[] = [];

        let openingBracket = 0;
        let closingBracket = 0;

        for (const line of lines) {
            if (line.includes("{")) {
                openingBracket += 1;
            }
            if (line.includes("}")) {
                closingBracket += 1;
            }

            functionRows.push(line);

            if (openingBracket <= closingBracket) {
                break;
            }
        }

        return functionRows;
    }

    public parseName(rows: string[]): string {
        const regex = /^\s*(\w*)/g;

        const match = regex.exec(rows[0])[1];

        return match;
    }

    public parseParams(rows: string[]): IParams {
        const regex = /\w*\(([^\)]+)*/g;

        const match = regex.exec(rows[0])[1];
        if (match === undefined) { return undefined; }

        const params = match.replace(/\s/g, "").split(",");

        return {
            paramList: params,
        };
    }

    public parseParamsTemplate(rows: string[]): string {
        const params = this.parseParams(rows);
        if (params === undefined) { return undefined; }

        let str: string = `$[${params[0]}]`;

        for (const param of params.slice(1)) {
            str += `, $[${param}]`;
        }

        return str;
    }

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
