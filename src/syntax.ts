import { ISyntaxTypes } from "./types";

export class CustomSyntax {

    public getSyntax(fileRows: string, type: string): ISyntaxTypes {
        if (type === "variables") {
            return this.getVariables(fileRows);
        } else if (type === "placeholders") {
            return this.getPlaceholders(fileRows);
        } else if (type === "repetitions") {
            return this.getRepetitions(fileRows);
        }
    }

    private getVariables(fileRows: string): ISyntaxTypes {
        const variables = new RegExp(/([^\\]\$\{[^\}]*\})/, "g");
        const match = this.matchRegex(fileRows, variables);
        return match;
    }

    private getPlaceholders(fileRows: string): ISyntaxTypes {
        const placeholders = new RegExp(/([^\\]\$\[[^\]]*\])/, "g");
        const match = this.matchRegex(fileRows, placeholders);
        return match;
    }

    private getRepetitions(fileRows: string): ISyntaxTypes {
        const repetitions = new RegExp(/([^\\]\$\<\d*\>\((?:.|\s)*\))/, "g");
        const match = this.matchRegex(fileRows, repetitions);
        return match;
    }

    private matchRegex(fileRows: string, regex: RegExp): ISyntaxTypes {
        let rawMatch: RegExpExecArray;
        const match: ISyntaxTypes = new Array();
        do {
            rawMatch = regex.exec(fileRows);
            const matchString = fileRows.substr(rawMatch.index + 1, rawMatch[0].length - 1);
            const matchStart = rawMatch.index + 1;
            const matchLength = rawMatch[0].length - 1;
            match.push({
                length: matchLength,
                start: matchStart,
                text: matchString,
            });
        } while (rawMatch);

        return match;
    }
}
