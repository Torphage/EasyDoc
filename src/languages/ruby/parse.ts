import { IParams } from "../../interfaces";
import { copy, removeStringBetweenChar } from "../../utils";
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

        let tempStr: string = copy(newlineRows.join("\n"));
        for (const temp of this.allRegex.syntax.string) {
            const char = temp.value;
            tempStr = removeStringBetweenChar(tempStr, char);
        }

        const tmpStr = tempStr.split("\n");

        let blockDepth = 0;
        let blockIndex = 0;

        for (const line of tmpStr) {
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

            blockIndex++;

            if (blockDepth <= 0) {
                break;
            }
        }

        return lines.slice(0, blockIndex);
    }

    public parseParams(params: string): IParams {
        const paramList = params.replace(/[^,\w:]+/g, "").split(",");
        const template = paramList.join(", ");

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
