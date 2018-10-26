import { BaseParse } from "../parse";

export class RubyParse extends BaseParse {
    private blockStarts: string[];

    constructor() {
        super();
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

    public parseBlock(rows: string[]): string[] {
        let numOfBlocks = 0;
        const functionRows: string[] = [];
        for (const lines of rows) {
            for (const blockStart of this.blockStarts) {
                const matchBlockStart = new RegExp("^\\s*" + blockStart + "\\s").test(lines);
                const matchEnd = new RegExp("^\\s*end").test(lines);
                if (matchBlockStart) {
                    numOfBlocks++;
                    break;
                }
                if (matchEnd) {
                    numOfBlocks--;
                    break;
                }
            }
            functionRows.push(lines);
            if (numOfBlocks === 0) {
                break;
            }
        }
        return functionRows;
    }

    public parseName(rows: string[]): string {
        const row = rows[0];
        for (const block of this.blockStarts) {
            const regex = new RegExp("^\\s*" + block + "\\s(\\w*)");
            const match = regex.exec(row);
            if (match !== null) {
                return match[1];
            }
        }
    }

    public parseParams(rows: string[]): string[] {
        const regex = new RegExp(/(?:class|def)\s\w*(?:\(|\s)(?!\()([^\)]+)*/, "g");
        const match = regex.exec(rows[0])[1];
        const params = match.replace(/\s/g, "").split(",");
        return params;
    }
}
