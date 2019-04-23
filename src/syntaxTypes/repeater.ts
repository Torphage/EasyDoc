/**
 * Handle everything about the variable type.
 */

/**
 * EasyDoc.
 */
import { IRepeater, ISyntaxType, ISyntaxVariable } from "../interfaces";
import { CustomSyntax } from "../syntax";

/**
 * Handle repeaters, converts their content and replaces the syntax with them.
 *
 * @export
 * @class Repeater
 */
export class Repeater {

    /**
     * The variables found within the template file.
     *
     * @private
     * @type {ISyntaxVariable}
     * @memberof Repeater
     */
    private vars: ISyntaxVariable;

    /**
     * Creates an instance of Repeater.
     *
     * @param {ISyntaxVariable} vars The available variables, defined by the Syntax class.
     * @memberof Repeater
     */
    constructor(vars: ISyntaxVariable) {
        this.vars = vars;
    }

    /**
     * Generate the repeaters, loops through the text by row and search for repeaters found withing.
     * Handles them if they are found.
     *
     * @param {string} text The text to search for repeaters from.
     * @returns {string} The text with converted repeaters.
     * @memberof Repeater
     */
    public generate(text: string): string {
        const snippet = [];

        const customTypes = new CustomSyntax();
        const repeaters = customTypes.getSyntax(text, "repeaters");

        for (let i = 0; i < text.length; i++) {
            const repeater = this.getRepeaterAtIndex(repeaters, i);

            if (repeater) {
                const snippetObj = this.repeatObj(repeater);

                snippet.push(snippetObj.snippetStr);

                i += snippetObj.offset - 1;
            } else {
                snippet.push(text[i]);
            }
        }

        return snippet.join("");
    }

    /**
     * Search for repeaters at a specific index.
     *
     * @private
     * @param {ISyntaxType[]} repeaters The repeaters to search with.
     * @param {number} index The index to search at.
     * @returns {ISyntaxType} The repeater at the specific index.
     * @memberof Repeater
     */
    private getRepeaterAtIndex(repeaters: ISyntaxType[], index: number): ISyntaxType {
        for (const repeater of repeaters) {
            if (repeater.start === index) {
                return repeater;
            }
        }
    }

    /**
     * Get text to repeat from withing the repeater.
     *
     * @private
     * @param {ISyntaxType} repeater The repeater with the text to repeat.
     * @returns {string[]} The string after it has been repeated.
     * @memberof Repeater
     */
    private getTextToRepeat(repeater: ISyntaxType): string[] {
        const result = this.repeatRegex(repeater);

        const timesToRepeat = this.timesToRepeat(repeater);
        const stringToRepeat = result[2];

        const snippetStrArr: string[] = [];

        for (let i = 0; i < timesToRepeat; i++) {
            snippetStrArr.push(
                stringToRepeat,
            );
        }

        return snippetStrArr;
    }

    /**
     * Get number of times to repeat the repeater's value.
     *
     * @private
     * @param {ISyntaxType} repeater The repeater to get the value to repeat.
     * @returns {number} The number of times to repeat.
     * @memberof Repeater
     */
    private timesToRepeat(repeater: ISyntaxType): number {
        const regexResult = this.repeatRegex(repeater);
        const timesToRepeat = regexResult[1];

        let num: number;

        if (isNaN(+timesToRepeat)) {
            num = this.vars[timesToRepeat];
        } else {
            num = +timesToRepeat;
        }

        return num;
    }

    /**
     * Get the number of times to repeat and what to repeat based on the repeater.
     *
     * @private
     * @param {ISyntaxType} repeater The repeater to parse from.
     * @returns {RegExpMatchArray} Number of tiems to repeat and what to repeat.
     * @memberof Repeater
     */
    private repeatRegex(repeater: ISyntaxType): RegExpMatchArray {
        const regex = /\<(\w*)\>\(((?:.|\s)*)/gm;
        const result: any[] = new Array();

        let rawMatch: RegExpExecArray;

        do {
            rawMatch = regex.exec(repeater.text.slice(1));

            if (rawMatch !== null) {
                result.push(rawMatch);
            }
        } while (rawMatch);

        return result[0];
    }

    /**
     * Repeat a repeater object.
     *
     * @private
     * @param {ISyntaxType} repeater The repeater that values will get repeated.
     * @returns {IRepeater} The offset and what to insert into the real text.
     * @memberof Repeater
     */
    private repeatObj(repeater: ISyntaxType): IRepeater {
        const snippetStrArr = this.getTextToRepeat(repeater);
        const snippetStr = snippetStrArr.join("");

        const timesToRepeat = this.timesToRepeat(repeater);

        const temp = 6 + String(timesToRepeat).length;
        const offset = snippetStrArr[0].length + temp;

        return {
            offset,
            snippetStr,
        };
    }
}
