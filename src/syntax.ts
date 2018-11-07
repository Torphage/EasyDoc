import { ISyntaxType } from "./types";

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

    private getVariables(fileRows: string): ISyntaxType[] {
        const variables = /([^\\]\$\{[^\}]*\})/g;
        const match = this.matchRegex(fileRows, variables);

        return match;
    }

    private getPlaceholders(fileRows: string): ISyntaxType[] {
        const placeholders = /([^\\]\$\[[^\]]*\])/g;
        const match = this.matchRegex(fileRows, placeholders);

        return match;
    }

    private getRepeaters(fileRows: string): ISyntaxType[] {
        const repeaters = /([^\\]\$\<(?:\w*)\>\((?:.|\s)*\))/g;
        const match = this.matchRegex(fileRows, repeaters);
        return match;
    }

    private matchRegex(fileRows: string, regex: RegExp): ISyntaxType[] {
        const match: ISyntaxType[] = new Array();

        let rawMatch: RegExpExecArray;

        do {
            rawMatch = regex.exec(fileRows);

            if (rawMatch !== null) {
                const matchString = fileRows.substr(rawMatch.index + 1, rawMatch[0].length - 1);
                const matchStart = rawMatch.index + 1;
                const matchLength = rawMatch[0].length - 1;

                match.push({
                    length: matchLength,
                    start: matchStart,
                    text: matchString,
                });
            }
        } while (rawMatch);

        return match;
    }
}
