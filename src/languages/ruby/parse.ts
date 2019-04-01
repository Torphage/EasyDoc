import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

export class RubyParse extends BaseParse {
    private blockStarts: string[];

    constructor(docType: string) {
        super(docType);
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

    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);
        const functionRows: string[] = [];

        let blockDepth = 0;

        for (const line of lines) {
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

            functionRows.push(line);

            if (blockDepth === 0) {
                break;
            }
        }

        return functionRows;
    }

    public parseParams(rows: string[]): IParams {
        const regex = this.regex.params.name;

        const match = regex.exec(rows[0])[1];
        console.log(match);
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
