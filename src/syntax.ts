/**
 * This is where the locations and positions of the different regular expressions are given from.
 */

/**
 * EasyDoc.
 */
import { ISyntaxType } from "./interfaces";

/**
 * Handle the custom syntax and gets the start and end index, and the text value
 * of the variables, placehodlers and repeaters.
 *
 * @export
 * @class CustomSyntax
 */
export class CustomSyntax {

    /**
     * Get the location and vlaue for the variables, placeholders or repeaters.
     *
     * @param {string} fileRows The file rows of which to get the position and value of a specific syntax type.
     * @param {string} type The type to get the list of. Can be either "variables", "placeholders" or "repeaters".
     * @returns {ISyntaxType[]} The list of the location and values of a specific type.
     * @memberof CustomSyntax
     */
    public getSyntax(fileRows: string, type: string): ISyntaxType[] {
        switch (type) {
            case "variables":
                return this.getVariables(fileRows);

            case "placeholders":
                return this.getPlaceholders(fileRows);

            case "repeaters":
                return this.getRepeaters(fileRows);

            case "errorhandlers":
                return this.getErrorHandlers(fileRows);
        }
    }

    /**
     * Match the file rows with a regex.
     *
     * @param {string} fileRows The file rows of which to match.
     * @param {RegExp} regex The regex to match with.
     * @returns {ISyntaxType[]} The list of the location and values of a specific type.
     * @memberof CustomSyntax
     */
    private matchRegex(fileRows: string, regex: RegExp): ISyntaxType[] {
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

    /**
     * Get the list of all the variables' position and value.
     *
     * @private
     * @param {string} fileRows The file rows of which to match.
     * @returns {ISyntaxType[]} The list of the location and values of a specific type.
     * @memberof CustomSyntax
     */
    private getVariables(fileRows: string): ISyntaxType[] {
        const variables = /(\$\{[^\}]*\})/g;
        const match = this.matchRegex(fileRows, variables);

        return match;
    }

    /**
     * Get the list of all the placeholder' position and value.
     *
     * @private
     * @param {string} fileRows The file rows of which to match.
     * @returns {ISyntaxType[]} The list of the location and values of a specific type.
     * @memberof CustomSyntax
     */
    private getPlaceholders(fileRows: string): ISyntaxType[] {
        const placeholders = /(\$\[[^\]]*\])/g;
        const match = this.matchRegex(fileRows, placeholders);

        return match;
    }

    /**
     * Get the list of all the repeater' position and value.
     *
     * @private
     * @param {string} fileRows The file rows of which to match.
     * @returns {ISyntaxType[]} The list of the location and values of a specific type.
     * @memberof CustomSyntax
     */
    private getRepeaters(fileRows: string): ISyntaxType[] {
        const repeaters = /(\$\<[^>]*\>\((?:.|\s)*?(?=\)\$))/g;
        const match = this.matchRegex(fileRows, repeaters);

        return match;
    }

    /**
     * Get the error block.
     *
     * @private
     * @param {string} fileRows The text to search for errors.
     * @returns {ISyntaxType[]} The error handlers.
     * @memberof CustomSyntax
     */
    private getErrorHandlers(fileRows: string): ISyntaxType[] {
        const regex = /\$\|((?:[^|]+|\$\|(?:[^$|]+|\$\|[^|$]*\|\$)*\|\$)*)\|\$/g;
        const match = this.matchRegex(fileRows, regex);

        return match;
    }

    /**
     * Check if the match is allowed and is not preceded by a backslash.
     *
     * @private
     * @param {string} fileRows The file rows of which to match.
     * @param {RegExpExecArray} match The match to check if valid.
     * @returns {boolean} If the match is valid.
     * @memberof CustomSyntax
     */
    private allowedMatch(fileRows: string, match: RegExpExecArray): boolean {
        const previousChar = fileRows[match.index - 1];

        if (previousChar !== "\\") {
                return true;
        }

        return false;
    }
}
