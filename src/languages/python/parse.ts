import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

export class PythonParse extends BaseParse {
    constructor(docType: string) {
        super(docType);
    }

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

    public parseParams(rows: string[]): IParams {
        const regex = this.regex.params.name;

        const match = regex.exec(rows[0])[1];
        if (match === undefined) {
            return {
                paramList: undefined,
            };
        }

        const params = match.replace(/\s/g, "").split(",");

        return {
            paramList: params,
        };
    }

    public parseParamsTemplate(rows: string[]): string {
        const params = this.parseParams(rows);
        if (params.paramList === undefined) { return undefined; }

        let str: string = `$[${params.paramList[0]}]`;

        for (const param of params.paramList.slice(1)) {
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
