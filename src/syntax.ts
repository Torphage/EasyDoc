import { ISyntaxType } from "./interfaces";

export class CustomSyntax {

    public getSyntax(fileRows: string, type: string): ISyntaxType[] {
        switch (type) {
            case "variables":
                return this.getVariables(fileRows);

            case "placeholders":
                return this.getPlaceholders(fileRows);

            case "repeaters":
                return this.getRepeaters(fileRows);
        }
    }

    public matchRegex(fileRows: string, regex: RegExp): ISyntaxType[] {
        const match: ISyntaxType[] = new Array();

        let rawMatch: RegExpExecArray;

        do {
            rawMatch = regex.exec(fileRows);

            if (rawMatch !== null) {
                if (this.allowedMatch(fileRows, rawMatch)) {
                    const matchStart = rawMatch.index;
                    const matchLength = rawMatch[0].length;
                    const matchString = rawMatch[0];

                    match.push({
                        length: matchLength,
                        start: matchStart,
                        text: matchString,
                    });
                }
            }
        } while (rawMatch);

        return match;
    }

    private getVariables(fileRows: string): ISyntaxType[] {
        const variables = /(\$\{[^\}]*\})/g;
        const match = this.matchRegex(fileRows, variables);

        return match;
    }

    private getPlaceholders(fileRows: string): ISyntaxType[] {
        const placeholders = /(\$\[[^\]]*\])/g;
        const match = this.matchRegex(fileRows, placeholders);

        return match;
    }

    private getRepeaters(fileRows: string): ISyntaxType[] {
        const repeaters = /(\$\<[^>]*\>\((?:.|\s)*?(?=\)\$))/g;
        const match = this.matchRegex(fileRows, repeaters);

        return match;
    }

    private allowedMatch(fileRows: string, match: RegExpExecArray): boolean {
        const previousChar = fileRows[match.index - 1];

        if (previousChar !== "\\") {
                return true;
        }

        return false;
    }
}
