/**
 * Some utility functions.
 */

/**
 * Deep copy a variable.
 *
 * @export
 * @param {*} variable The variable wanted a deep copy of.
 * @returns {*} The deep copied variable.
 */
export function copy(variable: any): any {
    let clone: any;

    if (typeof variable === "string") {
        clone = variable.split("").join("");
    } else {
        clone = Object.assign([], variable);
    }
    return clone;
}

/**
 * Replace every character with preceding backslash, including the backslash, with two hashes.
 *
 * @export
 * @param {string} str The string to replace characters in.
 * @returns {string} The modified string.
 */
export function removeEscapeFromString(str: string): string {
    return str.replace(/\\./g, "##");
}

/**
 * Replaces characters between characters with a hash, this is used only for counting
 * the index of other characters without including anything withing the characters given in paramters.
 * Will be used with different types of strings.
 *
 * @export
 * @param {string} str The string to replace.
 * @param {string} char The character to replace everything between.
 * @param {string} char The optional character if you want to match between two different characters.
 * @returns {string} A new string where everything in between a given character is replaced with hashes.
 */
export function removeStringBetweenChar(str: string, char: string, lastChar?: string): string {
    let newStr = removeEscapeFromString(str);
    while (true) {
        const firstOccurence = newStr.indexOf(char);
        if (firstOccurence === -1) { break; }
        const secondOccurence = newStr.indexOf(lastChar ? lastChar : char, firstOccurence + 1);
        if (secondOccurence === -1) { break; }

        const partString = newStr.slice(firstOccurence, secondOccurence + 1);
        newStr = newStr.replace(partString, "#".repeat(partString.length));
    }

    return newStr;
}

String.prototype.regexIndexOf = function(regex: RegExp, position?: number): number {
    const indexOf = this.substring(position || 0).search(regex);
    return (indexOf >= 0) ? (indexOf + (position || 0)) : indexOf;
};

String.prototype.regexLastIndexOf = function(regex: RegExp, position?: number): number {
    regex = (regex.global) ?
        regex : new RegExp(regex.source, "g" + (regex.ignoreCase ? "i" : "") + (regex.multiline ? "m" : ""));
    if (typeof (position) === "undefined") {
        position = this.length;
    } else if (position < 0) {
        position = 0;
    }
    const stringToWorkWith = this.substring(0, position + 1);
    let lastIndexOf = -1;
    let nextStop = 0;
    let result: RegExpExecArray;
    do {
        result = regex.exec(stringToWorkWith);
        lastIndexOf = result.index;
        regex.lastIndex = ++nextStop;
    } while (regex !== null);
    return lastIndexOf;
};
