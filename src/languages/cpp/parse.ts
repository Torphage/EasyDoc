import { IParams } from "../../interfaces";
import { BaseParse } from "../parse";

export class CppParse extends BaseParse {
    constructor(docType: string) {
        super(docType);
    }

    public parseBlock(newlineRows: string[]): string[] {
        const lines = this.splitLines(newlineRows);
        const functionRows: string[] = [];

        let openingBracket = 0;
        let closingBracket = 0;
        let blockStarted = false;

        for (const line of lines) {
            if (line.includes("{")) {
                blockStarted = true;
                openingBracket++;
            }

            if (line.includes("}")) {
                closingBracket++;
            }

            functionRows.push(line);

            if (!blockStarted) {
                this.blockStartIndex++;
                continue;
            }

            if (openingBracket <= closingBracket) {
                break;
            }
        }

        return functionRows;
    }

    public parseParams(rows: string[]): IParams {
        const regex = /\s*\w*\(([^\)]+)/g;

        let i: number = 1;
        let row: string;

        for (row of rows) {
            if (row.includes(")")) { break; }
            i++;
        }

        const text = rows.slice(0, i).join("");
        const match = regex.exec(text)[1];

        if (match === undefined) {
            return {
                paramList: undefined,
                paramTypes: undefined,
            };
        }

        const params = match.split(",");

        return this.extractTypeAndName(params);
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

    private extractTypeAndName(varName: string[]): IParams {
        const names: string[] = [];
        const types: string[] = [];

        let param: string;
        for (param of varName) {
            if (param.length === 1) { continue; }
            const name = param.split(/\s/g);
            names.push(name[name.length - 1]);
            types.push(name.slice(0, name.length - 1).join(" ").trim());
        }

        return {
            paramList: names,
            paramTypes: types,
        };
    }
}
