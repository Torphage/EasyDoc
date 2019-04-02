export function copy(variable: any): any {
    let clone: any;

    if (typeof variable === "string") {
        clone = variable.split("").join("");
    } else {
        clone = Object.assign([], variable)
    }
    return clone;
}

export function removeEscapeFromString(str: string): string {
    return str.replace(/\\./g, "##");
}

export function removeStringBetweenChar(str: string, char: string) {
    let newStr = removeEscapeFromString(str);
    while (true) {
        const firstOccurence = newStr.indexOf(char);
        if (firstOccurence === -1) { break; }
        const secondOccurence = newStr.indexOf(char, firstOccurence + 1);
        if (secondOccurence === -1) { break; }

        const partString = newStr.slice(firstOccurence, secondOccurence + 1);
        newStr = newStr.replace(partString, "#".repeat(partString.length));
    }

    return newStr;
}

String.prototype.regexIndexOf = function(regexp: RegExp, position?: number): number {
    const indexOf = this.substring(position || 0).search(regexp);
    return (indexOf >= 0) ? (indexOf + (position || 0)) : indexOf;
};

String.prototype.regexLastIndexOf = function(regexp: RegExp, position?: number): number {
    regexp = (regexp.global) ?
        regexp : new RegExp(regexp.source, "g" + (regexp.ignoreCase ? "i" : "") + (regexp.multiline ? "m" : ""));
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
        result = regexp.exec(stringToWorkWith);
        lastIndexOf = result.index;
        regexp.lastIndex = ++nextStop;
    } while (regexp !== null);
    return lastIndexOf;
};
